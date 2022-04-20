var express = require('express');
var router = express.Router();
var con = require('../db_config');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const type = req.query.type;
  res.render('loginForm', { type });
});

router.post('/', function(req, res, next) {
  const type = req.query.type;
  const { username, password } = req.body;
  const table = type === "admin" ? "Database_Manager" : type === "student" ? "Student" : "Instructor"

  con.query(
    `
    SELECT * 
    FROM User
    WHERE username = "${username}" AND password = "${password}" AND 
    username IN(SELECT username FROM ${table})
    `, 
    function (err, result, fields) {
    if (err) {
      console.log(err);
      next(err);
    }
    if(result.length === 0) {
      console.log(result)
      res.render('loginForm', { type, error: `There is no ${table} with this credentials!` });
    } else {
      console.log(result, 2)
      res.status(200).send("You are in");
    }
  });
});

module.exports = router;
