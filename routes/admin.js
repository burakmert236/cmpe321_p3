var express = require('express');
var router = express.Router();
var { capitalize } = require('../helpers');
var { getStudents } = require('../queries/adminQueries');

/* GET admin home page. */
router.get('/', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/adminHome', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET add new user form. */
router.get('/new_user', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/newUser', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET delete student form. */
router.get('/delete_student', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/deleteStudent', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET update title of instructor form. */
router.get('/update_title', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/updateTitle', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET list of students page. */
router.get('/students', function(req, res, next) {
  const user = req.user;
  if(user) {
    const students = getStudents();
    return res.render('admin/students', { user, title: "Database Manager Home Page", students })
  }
  return res.send("You are not an admin")
});

/* GET list of instructors page. */
router.get('/instructors', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/instructors', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET grades of a student form. */
router.get('/student_grade', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/studentGrade', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET courses of an instructor form. */
router.get('/instructor_course', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/intructorCourse', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET average grade of a course form. */
router.get('/avg_grade', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/avgGrade', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

module.exports = router;
