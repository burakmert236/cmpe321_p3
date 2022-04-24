var con = require('../db_config');

const availableClassrooms = (body, cb) => {
    // first part not correct, must be checked
    const query = `
        SELECT Cls.classroom_id, Cls.campus, Cls.capacity
        FROM Classroom Cls, Is_Given_In Gvn
        WHERE Cls.classroom_id = Gvn.classroom_id AND Gvn.time_slot != ${body.time_slot}
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

module.exports = {
    availableClassrooms,
}