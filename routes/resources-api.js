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
    console.log(validUser);
    if(!validUser) {
        return res.redirect("/")
      }

      const resources = await db.query(`SELECT * FROM resources WHERE user_id = $1 limit 3;`, [validUser.rows[0].id]);
      const likes = await db.query(`SELECT * FROM likes JOIN resources ON resource_id = resources.id WHERE likes.user_id = $1 limit 3;`, [ user_id ]);
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
router.get('/new', async (req, res) => {
  const { user_id } = req.session; // check cookies
  if (!user_id) {
    return res.send('You need to login first');
  }

try {
    const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); // check id with the database id
    console.log(validUser);
    if(!validUser) {
        return res.send("You are not allowed to be here!")
      }

    const templateVars = {
      user: validUser.rows[0],
    };
      res.render("new", templateVars);
    } catch (error) {
   return res.status(400).send({ message: error.message });
  }
});



// Get a single resource
router.get('/:id', async (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.send("You are not allowed to access this resource");
  }

  const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //
  if(!validUser) {
    return res.send("You are not allowed to be here")
  }
  
  const rId = req.params.id

  const feedbacks = await db.query(`SELECT * FROM feedbacks WHERE resource_id = $1 ORDER BY id DESC;`, [rId]); //
  if(!feedbacks) {
    return res.send("No feedbacks found!")
  }

    try {
      const singleResource = await db.query(`SELECT * FROM resources WHERE id = $1`, [rId])
      const templateVars = {
        user: validUser.rows[0],
        singleResource: singleResource.rows[0],
        resourceid: rId,
        feedbacks: feedbacks.rows
      };
      console.log(feedbacks.rows)
      //console.log(templateVars)
      return res.render('singleResource', templateVars);
  } catch (error) {
    return res.status(500).send("Internal server error")
  }
});

// Adding new resources
router.post('/new', async (req, res) => {
  // console.log(req.body);
  // const id = req.body.categoryId;
  // const title = req.body.title;
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(400).send('You need to be logged in')
  }

  try {
    const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id])

    if (!validUser) {
       return res.send('you are not allowed to be here');
    }
  const { title, url, url_cover_photo, description, categoryId} = req.body;

  if (!title || !url || !url_cover_photo || !description) {
    return res.status(400)
    .send("You need to fill title, category, url, url_cover_photo or description fields");
  }
  await db.query(`INSERT INTO resources (title, url, url_cover_photo, description, user_id, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
  [title, url, url_cover_photo, description, user_id, categoryId]);
  return res.redirect("/api/resources");
  } catch (error) {
    return res.status(400).send( { message: error.message } )
  }
});

// for making post request on drop down
router.post('/category', async (req, res) => {
  const id = req.body.categoryId;
  const { user_id } = req.session; // check cookies
  if (!user_id) {
    return res.send("You need to login first");
  }

  try {
  const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //
  if(!validUser) {
    return res.send("You are not allowed to be here")
  }

  const resources = await db.query(`SELECT * FROM resources Where category_id =$1;`, [id]);

  const templateVars = {
   user: validUser.rows[0],
   resources: resources.rows
  };
  // console.log(templateVars);
  return res.render("index", templateVars);
  // console.log(id);
  }catch (error) {
    return res.status(400).send({ message: error.message });
}
});

// Adding feedbacks
router.post('/feedbacks', async (req, res) => { 
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(400).send('You need to be logged in')
  }

  try {
    const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id])

    if (!validUser) {
       return res.send('You are not allowed to be here');
    }
    
    const { comment, rating } = req.body;
    console.log(req.body);
    if (!comment || !rating) {
      return res.status(400)
      .send("You need to fill all fields");
    }
    await db.query(`INSERT INTO feedbacks (comment, rating, user_id, resource_id) VALUES ($1, $2, $3, $4) RETURNING *;`,
    [comment, rating, user_id, req.body.resourceid]);
    return res.redirect(`/api/resources/${req.body.resourceid}`);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
})

// Adding likes
router.post('/likes', async (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(400).send('You need to be logged in')
  }

  try {
    const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id])
    
    if (!validUser) {
       return res.send('You are not allowed to be here');
    }

    await db.query(`INSERT INTO likes (user_id, resource_id) VALUES ($1, $2) RETURNING *;`,
    [user_id, req.body.resourceid]);
    return res.redirect(`/api/resources/${req.body.resourceid}`);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
})

module.exports = router;
