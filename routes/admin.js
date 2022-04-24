var express = require('express');
var router = express.Router();
var { capitalize } = require('../helpers');
var con = require('../db_config');
var { 
  getStudents,
  getInstructors,
  createStudent,
  createInstructor,
} = require('../queries/adminQueries');

/* GET admin home page. */
router.get('/', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/adminHome', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});

/* GET add new student form. */
router.get('/new_student', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/newStudent', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});
/* POST add new student. */
router.post('/new_student', function(req, res, next) {
  createStudent(req.body, function(result) {
    console.log(result)
    let message = ""
    if(result) {
      message = "Student created successfuly"
    } else {
      message = "Student couldn't created successfuly"
    }
    return res.render('admin/newStudent', { title: "Database Manager Home Page", message })
  });
});

/* GET add new instructor form. */
router.get('/new_instructor', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/newInstructor', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});
/* POST add new instructor. */
router.post('/new_instructor', function(req, res, next) {
  createInstructor(req.body, function(result) {
    let message = ""
    if(result) {
      message = "Instructor created successfuly"
    } else {
      message = "Instructor couldn't created successfuly"
    }
    return res.render('admin/newInstructor', { title: "Database Manager Home Page", message })
  });
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
  if(user) {
    const instructors = getInstructors();
    return res.render('admin/instructors', { user, title: "Database Manager Home Page", instructors })
  }
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
