var express = require('express');
var router = express.Router();
var { capitalize } = require('../helpers');
var con = require('../db_config');
var { 
  getStudents,
  getInstructors,
  createStudent,
  createInstructor,
  deleteStudent,
  updateTitle,
  studentGrades,
  instructorCourses,
  avgGrade
} = require('../queries/adminQueries');

/* GET admin home page. */
router.get('/', function(req, res, next) {
  const user = req.user;
  return res.render('admin/adminHome', { user, title: "Database Manager Home Page" })
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
      message = "Student is created successfuly"
    } else {
      message = "Student couldn't be created successfuly"
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
      message = "Instructor is created successfuly"
    } else {
      message = "Instructor couldn't be created successfuly"
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
/* POST delete student. */
router.post('/delete_student', function(req, res, next) {
  deleteStudent(req.body, function(result) {
    let message = ""
    if(result) {
      message = "Student is deleted successfuly"
    } else {
      message = "Student couldn't be deleted successfuly"
    }
    return res.render('admin/deleteStudent', { title: "Database Manager Home Page", message })
  });
});

/* GET update title of instructor form. */
router.get('/update_title', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('admin/updateTitle', { user, title: "Database Manager Home Page" })
  return res.send("You are not an admin")
});
/* POST update title of instructor. */
router.post('/update_title', function(req, res, next) {
  updateTitle(req.body, function(result) {
    let message = ""
    if(result) {
      message = "Instructor is updated successfuly"
    } else {
      message = "Instructor couldn't be updated successfuly"
    }
    return res.render('admin/updateTitle', { title: "Database Manager Home Page", message })
  });
});

/* GET list of students page. */
router.get('/students', function(req, res, next) {
  getStudents(function (result) {
    return res.render('admin/students', { 
      title: "Database Manager Home Page", 
      students: result, 
      message: result === false ? "Student couldn't be listed" : "" 
    })
  });
});

/* GET list of instructors page. */
router.get('/instructors', function(req, res, next) {
  getInstructors(function (result) {
    return res.render('admin/instructors', { 
      title: "Database Manager Home Page", 
      instructors: result, 
      message: result === false ? "Instructors couldn't be listed" : "" 
    })
  });
});

/* GET grades of a student form. */
router.get('/student_grade', function(req, res, next) {
  return res.render('admin/studentGrades', { 
    title: "Database Manager Home Page",
  })
});
/* POST grades of a student. */
router.post('/student_grade', function(req, res, next) {
  studentGrades(req.body, function (student, result) {
    return res.render('admin/studentGrades', { 
      title: "Database Manager Home Page",
      courses: result,
      student,
      message: result === false ? "Courses couldn't be listed" : "" 
    })
  });
});

/* GET courses of an instructor form. */
router.get('/instructor_course', function(req, res, next) {
  return res.render('admin/instructorCourses', { 
    title: "Database Manager Home Page",
  })
});
/* POST courses of an instructor */
router.post('/instructor_course', function(req, res, next) {
  instructorCourses(req.body, function (instructor, result) {
    return res.render('admin/instructorCourses', { 
      title: "Database Manager Home Page",
      courses: result,
      instructor,
      message: result === false ? "Courses couldn't be listed" : "" 
    })
  });
});

/* GET average grade of a course form. */
router.get('/avg_grade', function(req, res, next) {
  return res.render('admin/avgGrade', { 
    title: "Database Manager Home Page",
  })
});
/* POST average grade of a course */
router.post('/avg_grade', function(req, res, next) {
  avgGrade(req.body, function (course, result) {
    return res.render('admin/avgGrade', { 
      title: "Database Manager Home Page",
      avg: result ? result : 0,
      course,
      message: result === false ? "Average couldn't be computed" : "" 
    })
  });
});

module.exports = router;
