var express = require('express');
var router = express.Router();
var con = require('../db_config');
var passport = require('../auth');
var { capitalize } = require('../helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const type = req.query.type;
  res.render('loginForm', { type });
});

router.post('/', passport.authenticate('local', { failureRedirect: '/' }), function(req, res, next) {
  res.redirect(`/${req.query.type}`)
});

module.exports = router;
