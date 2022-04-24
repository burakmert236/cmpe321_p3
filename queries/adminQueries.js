var con = require('../db_config');

const getStudents = (cb) => {
    const query = `
        SELECT U.username, U.name, U.surname, U.email, D.name, S.completed_credits, S.GPA 
        FROM Student S, User U, Department D, Belongs_To B
        WHERE U.username = S.username AND B.username = S.username AND U.username = B.username AND
            B.department_id = D.department_id
        ORDER BY S.completed_credits ASC
        `
    con.query(query, function (err, result, fields) {
        console.log(err)
        err ? cb(false) : cb(result);
    });
};

const getInstructors = (cb) => {
    const query = `
        SELECT U.username, U.name, U.surname, U.email, D.name, I.title
        FROM Instructor I, User U, Department D, Belongs_To B
        WHERE U.username = I.username AND B.username = I.username AND U.username = B.username AND
            B.department_id = D.department_id
        `
    con.query(query, function (err, result, fields) {
        console.log(err)
        err ? cb(false) : cb(result);
    });
};

const createStudent = (body, cb) => {
    const query = `
        INSERT INTO User (username, name, surname, password, email)
        VALUES ("${body.username}", "${body.name}", "${body.surname}", "${body.password}", "${body.email}");
        INSERT INTO Student (username, completed_credits, GPA)
        VALUES ("${body.username}", 0, 0);
        `
    con.query(query, function (err, result, fields) {
        console.log(err)
        err ? cb(false) : cb(true);
    });
}

const createInstructor = (body, cb) => {
    const query = `
        INSERT INTO User (username, name, surname, password, email)
        VALUES ("${body.username}", "${body.name}", "${body.surname}", "${body.password}", "${body.email}");
        INSERT INTO Instructor (username, title)
        VALUES ("${body.username}", "${body.title}");
        `

    con.query(query, [], function (err, result, fields) {
        console.log(err)
        err ? cb(false) : cb(true);
    });
}

const deleteStudent = (body, cb) => {
    const query = `
        DELETE FROM Student WHERE student_id = ${body.student_id}
    `

    con.query(query, [], function (err, result, fields) {
        console.log(err)
        err ? cb(false) : cb(true);
    });
} 

const updateTitle = (body, cb) => {
    const query = `
        UPDATE Instructor
        SET title = "${body.title}"
        WHERE username = "${body.username}"
    `
    console.log(query)

    con.query(query, [], function (err, result, fields) {
        console.log(err)
        err ? cb(false) : cb(true);
    });
} 

const studentGrades = (body, cb) => {
    const query = `
        SELECT C.course_id, C.name, T.grade
        FROM Student S, Course C, Takes T
        WHERE S.student_id = "${body.student_id}" AND S.student_id = T.student_id AND
            C.course_id = T.course_id
    `

    con.query(query, [], function (err, result, fields) {
        console.log(err)
        err ? cb(body.student_id, false) : cb(body.student_id, result);
    });
} 

const instructorCourses = (body, cb) => {
    const query = `
        SELECT C.course_id, C.name, Cls.classroom_id, Cls.campus, Gvn.time_slot
        FROM Course C, Instructor I, Gives G, Is_Given_In Gvn, Classroom Cls
        WHERE I.username = "${body.username}" AND I.username = G.username AND
            C.course_id = G.course_id AND C.course_id = Gvn.course_id AND G.course_id = Gvn.course_id
            AND Gvn.classroom_id = Cls.classroom_id
    `

    con.query(query, [], function (err, result, fields) {
        console.log(err)
        err ? cb(body.username, false) : cb(body.username, result);
    });
} 

const avgGrade = (body, cb) => {
    const query = `
        SELECT AVG(T.grade) AS average
        FROM Course C, Takes T
        WHERE C.course_id = "${body.course_id}" AND T.course_id = C.course_id
    `

    con.query(query, [], function (err, result, fields) {
        err ? cb(body.course_id, false) : cb(body.course_id, result[0].average);
    });
} 

module.exports = {
    getStudents,
    getInstructors,
    createStudent,
    createInstructor,
    deleteStudent,
    updateTitle,
    studentGrades,
    instructorCourses,
    avgGrade
}