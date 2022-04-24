var express = require('express');
var router = express.Router();

var { 
    availableClassrooms
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

module.exports = router;