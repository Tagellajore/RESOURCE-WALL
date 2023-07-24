/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
// router.get('/users', (req, res) => {
//   res.render('users');
// }); 

// // // Add new resources 
// // router.get('/resources/new', (req, res) => {
// //    res.render("new");
// // });

// // router.post('/resources/new', (req, res) => {
// //   console.log(req.body);


// //  res.redirect('/')
// // });

  return router;
}