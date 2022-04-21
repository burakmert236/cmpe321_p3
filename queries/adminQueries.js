var con = require('../db_config');

const getStudents = () => {
    const query = `
        SELECT U.username, U.name, U.surname, U.email, D.name 
        FROM Student S, User U, Department D, Belongs_To B
        WHERE U.username = S.username AND B.username = S.username AND U.username = B.username AND
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

module.exports = {
    getStudents
}