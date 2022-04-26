var express = require('express');
var router = express.Router();

var { 
    availableClassrooms,
    createCourse,
    createPrerequisite,
    getCourses,
    getStudents,
    updateName,
    gradeStudent
  } = require('../queries/instructorQueries');

/* GET admin home page. */
router.get('/', function(req, res, next) {
  const user = req.user;
  return res.render('instructor/instructorHome', { user, title: "Instructor Home Page" })
});

/* GET average grade of a course form. */
router.get('/available_classroom', function(req, res, next) {
    return res.render('instructor/availableClassroom', { 
      title: "Instructor Home Page",
    })
  });
  /* POST average grade of a course */
router.post('/available_classroom', function(req, res, next) {
    availableClassrooms(req.body, function (slot, result) {
      return res.render('instructor/availableClassroom', { 
        title: "Instructor Home Page" ,
        classrooms: result,
        slot,
        message: result === false ? "Available Classrooms couldn't be foundd" : "" 
      })
    });
});


/* GET add new course form. */
router.get('/new_course', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('instructor/newCourse', { user, title: "Instructor Home Page" })
  return res.send("You are not an instructor")
});
/* POST add new course. */
router.post('/new_course', function(req, res, next) {
  createCourse(req.query.name, req.body, function(result) {
    let message = ""
    if(result) {
      message = "Course is created successfuly"
    } else {
      message = "Course couldn't be created successfuly"
    }
    return res.render('instructor/newCourse', { user: {username: req.query.username}, title: "Instructor Home Page", message })
  });
});


/* GET add new course form. */
router.get('/new_prerequisite', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('instructor/newPrerequisite', { user, title: "Instructor Home Page" })
  return res.send("You are not an instructor")
});
/* POST add new course. */
router.post('/new_prerequisite', function(req, res, next) {
  createPrerequisite(req.body, function(result) {
    let message = ""
    if(result) {
      message = "Prerequisite is created successfuly"
    } else {
      message = "Prerequisite couldn't be created successfuly"
    }
    return res.render('instructor/newPrerequisite', { user: {username: req.query.username}, title: "Instructor Home Page", message })
  });
});



/* GET list of all courses page. */
router.get('/courses', function(req, res, next) {
  getCourses(req.query.name, function (result) {
    return res.render('instructor/courses', { 
      title: "Instructor Home Page", 
      courses: result, 
      message: result === false ? "Courses couldn't be listed" : "" 
    })
  });
});


/* GET list of all students page. */
router.get('/students', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('instructor/students', { user, title: "Instructor Home Page" })
  return res.send("You are not an instructor")
});
/* POST list of students. */
router.post('/students', function(req, res, next) {
  getStudents(req.query.name, req.body, function(result) {
    let message = ""
    if(!result) {
      message = "Students couldn't be listed"
    }
    return res.render('instructor/students', { 
      user: {username: req.query.username}, 
      title: "Instructor Home Page", 
      message,
      students: result,
      course_id: req.body.course_id,
    })
  });
});


/* GET update name form. */
router.get('/update_name', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('instructor/updateName', { user, title: "Instructor Home Page" })
  return res.send("You are not an instructor")
});
/* POST update name. */
router.post('/update_name', function(req, res, next) {
  updateName(req.query.name, req.body, function(result) {
    let message = ""
    if(result) {
      message = "Name is updated successfuly"
    } else {
      message = "Name couldn't be updated successfuly"
    }
    return res.render('instructor/updateName', { user: {username: req.query.username}, title: "Instructor Home Page", message })
  });
});



/* GET grade student form. */
router.get('/grade_student', function(req, res, next) {
  const user = req.user;
  if(user) return res.render('instructor/gradeStudent', { user, title: "Instructor Home Page" })
  return res.send("You are not an instructor")
});
/* POST grade student. */
router.post('/grade_student', function(req, res, next) {
  gradeStudent(req.query.name, req.body, function(result) {
    let message = ""
    if(result) {
      message = "Grade is created successfuly"
    } else {
      message = "Grade couldn't be created successfuly"
    }
    return res.render('instructor/gradeStudent', { user: {username: req.query.username}, title: "Instructor Home Page", message })
  });
});


module.exports = router;