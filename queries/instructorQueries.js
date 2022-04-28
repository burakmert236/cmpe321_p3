var con = require('../db_config');

const createCourse = (username, body, cb) => {
    const query = `
        INSERT INTO Course (course_id, name, credits, quota)
        SELECT "${body.course_id}" AS course_id, "${body.name}" AS name, ${body.credits} AS credits, ${body.quota} AS quota
        WHERE EXISTS (SELECT * FROM Classroom WHERE classroom_id = ${body.classroom_id} AND capacity >= ${body.quota} );

        INSERT INTO Gives (username, course_id)
        SELECT "${username}" AS username, "${body.course_id}" AS course_id
        WHERE EXISTS (SELECT * FROM Classroom WHERE classroom_id = ${body.classroom_id} AND capacity >= ${body.quota} );

        INSERT INTO Is_Given_In (classroom_id, course_id, time_slot)
        SELECT ${body.classroom_id} AS classroom_id, "${body.course_id}" AS course_id, ${body.time_slot} AS time_slot
        WHERE EXISTS (SELECT * FROM Classroom WHERE classroom_id = ${body.classroom_id} AND capacity >= ${body.quota} );
    `
    con.query(query, function (err, result, fields) {
        console.log(result)
        err || result[0].affectedRows === 0 ? cb(false) : cb(true);
    });
} 

const availableClassrooms = (body, cb) => {
    const query = `
        SELECT Cls.classroom_id, Cls.campus, Cls.capacity
        FROM Classroom Cls
        WHERE Cls.classroom_id NOT IN (
            SELECT Cls2.classroom_id 
            FROM Classroom Cls2, Is_Given_In Gvn
            WHERE Cls2.classroom_id = Gvn.classroom_id AND Gvn.time_slot = ${body.time_slot}
        )
        UNION
        SELECT Cls.classroom_id, Cls.campus, Cls.capacity
        FROM Classroom Cls
        WHERE Cls.classroom_id NOT IN (
            SELECT Cls2.classroom_id 
            FROM Classroom Cls2, Is_Given_In Gvn
            WHERE Cls2.classroom_id = Gvn.classroom_id
        )
    `
    con.query(query, function (err, result, fields) {
        console.log(err)
        err ? cb(body.time_slot, false) : cb(body.time_slot, result);
    });
} 

const createPrerequisite = (body, cb) => {
    // first part not correct, must be checked
    const query = `
        INSERT INTO Prerequisite_Of (course_id, prerequisite_id)
        VALUES ("${body.course_id_m}", "${body.course_id_p}")
    `
    con.query(query, function (err, result, fields) {
        console.log(err, result)
        err || result.affectedRows === 0 ? cb(false) : cb(true);
    });
} 

const getCourses = (username, cb) => {
    const query = `
        SELECT C.course_id, C.name, Gvn.classroom_id, Gvn.time_slot, C.quota, Group_Concat(P.prerequisite_id SEPARATOR ", ") AS pre_list
        FROM Course C, Is_Given_In Gvn, Gives G, Course Pres, Prerequisite_Of P
        WHERE G.username = "${username}" AND G.course_id = C.course_id AND Gvn.course_id = C.course_id AND
            G.course_id = Gvn.course_id AND P.course_id = C.course_id AND Pres.course_id = P.course_id
        GROUP BY C.course_id
        UNION
        SELECT C.course_id, C.name, Gvn.classroom_id, Gvn.time_slot, C.quota, "" AS pre_list
        FROM Course C, Is_Given_In Gvn, Gives G
        WHERE G.username = "${username}" AND G.course_id = C.course_id AND Gvn.course_id = C.course_id AND
            G.course_id = Gvn.course_id AND C.course_id NOT IN (SELECT C.course_id from Course C, Prerequisite_Of P where C.course_id = P.course_id)

    `
    con.query(query, function (err, result, fields) {
        console.log(err, result)
        err || result.affectedRows === 0 ? cb(false) : cb(result);
    });
} 

const getStudents = (username, body, cb) => {
    // first part not correct, must be checked
    const query = `
        SELECT U.username, U.email, U.name, U.surname, S.student_id
        FROM User U, Student S, Takes T
        WHERE T.course_id = "${body.course_id}" AND S.username = U.username AND T.student_id = S.student_id AND
            EXISTS (SELECT * FROM Gives WHERE username = "${username}" AND course_id = "${body.course_id}")

    `
    con.query(query, function (err, result, fields) {
        console.log( err, result)
        err || result.affectedRows === 0 ? cb(false) : cb(result);
    });
} 

const updateName = (username, body, cb) => {
    const query = `
        UPDATE Course
        SET name = "${body.name}"
        WHERE course_id = "${body.course_id}"
            AND EXISTS (SELECT * FROM Gives WHERE username = "${username}" AND course_id = "${body.course_id}")

    `
    con.query(query, function (err, result, fields) {
        console.log(err, result)
        err || result.affectedRows === 0 ? cb(false) : cb(true);
    });
} 


const gradeStudent = (username, body, cb) => {
    const query = `
        UPDATE Takes
        SET grade = ${body.grade}
        WHERE course_id = "${body.course_id}" AND student_id = ${body.student_id}
            AND EXISTS (SELECT * FROM Gives WHERE username = "${username}" AND course_id = "${body.course_id}")

    `
    console.log(query)
    con.query(query, function (err, result, fields) {
        console.log(err, result)
        err || result.affectedRows === 0 ? cb(false) : cb(true);
    });
} 

module.exports = {
    availableClassrooms,
    createCourse,
    createPrerequisite,
    getCourses,
    getStudents,
    updateName,
    gradeStudent
}