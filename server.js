// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const db = require('./db/connection');
const cookieSession = require("cookie-session");

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

app.use(
  cookieSession({
    name: "session",
    keys: ["key"],
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).




//app.get('/', (req, res) => {
//  res.render('index');
//});

app.get('/login/:id', (req, res) => {
  // using encrypted cookies
  req.session.user_id = req.params.id;

  // console.log(req.params.id);

  // send the user somewhere
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.render("index");
});

app.get('/', (req, res) => {
  res.render("users");
});

// Get  resources
app.get('/resources', async (req, res) => {
  const { user_id } = req.session; // check cookies
  if (!user_id) {
    return res.redirect('/');
  }

  try {
  const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]);
  if(!validUser) {
    return res.redirect("/")
  }

  const resources = await db.query(`SELECT * FROM resources;`);
  const templateVars = {
   user: validUser.rows[0],
   resources: resources.rows
  };
  // console.log(templateVars);
  return res.render("resources", templateVars);
  } catch (error) {
    return res.status(400).send({ message: error.message });
 }
});
// Get a single user profile
app.get('/users/:id', async (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.redirect("/logout");
  }

  const rId = req.params.id
  if (user_id === rId) {
    try {
      const profile = await db.query(`SELECT * FROM users WHERE id = $1`, [rId])
      const templateVars = {
        profile: profile.rows[0]
      };
      // console.log(templateVars)
      return res.render('profile', templateVars);
  } catch (error) {
    return res.status(500).send("Internal server error")
  }
  }
});
// Add new resources
app.get('/resources/new', (req, res) => {
  res.render("new");
});

// Adding new resources
app.post('/resources/new', async (req, res) => {
  console.log(req.body);
  // const title = req.body.title;
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(400).send('You need to be logged in')
  }

  try {
    const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id])

    if (!validUser) {
       return res.redirect('/');
    }
  const { title, url, url_cover_photo, description } = req.body;

  if (!title || !url || !url_cover_photo || !description) {
    return res.status(400)
    .send("You need to fill title, category, url, url_cover_photo or description fields");
  }
  await db.query(`INSERT INTO resources (title, url, url_cover_photo, description, user_id, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
  [title, url, url_cover_photo, description, user_id, 2]);
  return res.redirect("/resources");
  } catch (error) {
    return res.status(400).send( { message: error.message } )
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
