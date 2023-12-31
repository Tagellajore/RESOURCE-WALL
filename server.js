// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const db = require('./db/connection');
const cookieSession = require("cookie-session");
//const routes = require('./routes');

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

//app.use(routes(db));
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const resourcesApiRoutes = require('./routes/resources-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/resources', resourcesApiRoutes);
//app.use('/api/users', userApiRoutes);
//app.use('/users', usersRoutes);
//app.use('/resources/new', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// login route
// do this instead
app.get('/login/:id', (req, res) => {
  // using encrypted cookies
  req.session.user_id = req.params.id;

  // console.log(req.params.id);

  // send the user somewhere
  res.redirect('/api/resources');
});

// logout
app.get('/logout', (req, res) => {
  req.session = null;

  res.send("Successfully Logged Out!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
