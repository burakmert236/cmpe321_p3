var express = require('express');
var router = express.Router();
var { capitalize } = require('../helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const user = req.user;
  console.log(user, 12)
  if(user) return res.send("You are an admin")
  return res.send("You are not an admin")
});

module.exports = router;
