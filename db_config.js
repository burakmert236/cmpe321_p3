const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "02360236b",
    database: "SimpleBoun"
});
  
con.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    };
    console.log("Connected to mysql database!");
});

module.exports = con;