var con = require('../db_config');

const getStudents = () => {
    const query = `
        SELECT U.username, U.name, U.surname, U.email, D.name, S.completed_credits, S.GPA 
        FROM Student S, User U, Department D, Belongs_To B
        WHERE U.username = S.username AND B.username = S.username AND U.username = B.username AND
            B.department_id = D.department_id
        ORDER BY S.completed_credits ASC
        `
    con.query(query, function (err, result, fields) {
        console.log(err, result)
        if (err) {
            console.log(err);
            return err;
        }
        return result;
    });
};

const getInstructors = () => {
    const query = `
        SELECT U.username, U.name, U.surname, U.email, D.name, I.title
        FROM Instructor I, User U, Department D, Belongs_To B
        WHERE U.username = I.username AND B.username = I.username AND U.username = B.username AND
            B.department_id = D.department_id
        `
    con.query(query, function (err, result, fields) {
        console.log(err, result)
        if (err) {
            console.log(err);
            return err;
        }
        return result;
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
        err ? cb(false) : cb(true);;
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
        err ? cb(false) : cb(true);;
    });
}

module.exports = {
    getStudents,
    getInstructors,
    createStudent,
    createInstructor
}