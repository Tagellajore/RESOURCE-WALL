/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const db = require('../db/connection');

// Get a single user profile 
router.get('/:id', async (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.redirect("/");
  }

  const rId = req.params.id
  if (user_id === rId) {
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]);
      const profile = await db.query(`SELECT * FROM users WHERE id = $1`, [rId])
      const templateVars = {
        user: validUser.rows[0],
        profile: profile.rows[0]
      };
      console.log(templateVars)
      return res.render('profile', templateVars);
  } catch (error) {
    return res.status(500).send("Internal server error")
  }
  }
});

// update user info 
router.post('/edit/:id', async (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(400).send("You need to be logged in!");
  }
  
  const { id } = req.params;

  try {
    if (user_id === id) {
       const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]);
       if (validUser.rows.length === 0) {
         return res.redirect("/");
       }
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400)
      .send("You need to fill the name, email or password!");
    }
    
    await db.query(
      `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4;`,
      [name, email, password, id]
    );
    return res.redirect(`/api/users/${id}`)
  } catch (error) {
    return res.status(500).send("Internal server error")
  }
})

module.exports = router;
