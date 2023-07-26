/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const resourceQueries = require('../db/queries/resources');
const db = require('../db/connection');


// // Get  all resources --- resources created by a single user
router.get("/", async (req, res) => {
  const { user_id } = req.session; // check cookies
  if (!user_id) {
    return res.send("You need to login first");
  }
  
  try {
  const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //  
  if(!validUser) {
    return res.redirect("/")
  }

  const resources = await db.query(`SELECT * FROM resources Limit 3;`);
  
  const templateVars = {
   user: validUser.rows[0],
   resources: resources.rows
  };
  // console.log(templateVars);
  return res.render("index", templateVars);
  } catch (error) {
    return res.status(400).send({ message: error.message });
 }
});

// Get  Myresources(created by a single user) and resources liked by me
router.get('/myresources', async (req, res) => {
  const { user_id } = req.session; // check cookies
  if (!user_id) {
    return res.redirect('/');
  }
  
  try {
  const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); // check id with the database id
  if(!validUser) {
    return res.redirect("/")
  }
   
  const resources = await db.query(`SELECT * FROM resources WHERE user_id = $1;`, [validUser.rows[0].id]);
  const likes = await db.query(`SELECT * FROM likes JOIN resources ON resource_id = resources.id WHERE likes.user_id = $1`, [ user_id ]);
  const templateVars = {
   user: validUser.rows[0],
   resources: resources.rows,
   likes: likes.rows
  };
  console.log(templateVars);
  return res.render("myresources", templateVars);
  } catch (error) {
    return res.status(400).send({ message: error.message });
 }
});

// Add new resources page
router.get('/new', (req, res) => {
  res.render("new");
});

// Adding new resources 
router.post('/new', async (req, res) => {
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
  return res.redirect("/");
  } catch (error) {
    return res.status(400).send( { message: error.message } )
  }
});

// for making post request on drop down 
router.post('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
});


module.exports = router;