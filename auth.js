const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const con = require('./db_config');

passport.use(new LocalStrategy(
    {
        passReqToCallback: true
    },
    function(req, username, password, done) {
        const type = req.query.type.toLocaleLowerCase();

        const sql_query = type === "database_manager" ?
        `
            SELECT * FROM Database_Manager
            WHERE username = "${username}" AND password = "${password}"
        ` :
        `
            SELECT * 
            FROM User
            WHERE username = "${username}" AND password = "${password}" AND 
            username IN(SELECT username FROM ${type})
        `;

        con.query(sql_query, function (err, result, fields) {
            console.log(err, result)
            if (err) {
                console.log(err);
                return done(err);
            }
            if(result.length === 0) return done(null, false);
            else return done(null, result[0])
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log(user)
    done(null, user.username); 
});

// used to deserialize the user
passport.deserializeUser(function(username, done) {
    console.log(username)
    const sql_query1 = `
        SELECT * FROM Database_Manager
        WHERE username = "${username}"`;
    const sql_query2 = `
        SELECT * FROM Database_Manager
        WHERE username = "${username}"`;
    con.query(sql_query1, function (err, result, fields) {
        if(result.length !== 0) done(err, result[0]);
    });
    con.query(sql_query2, function (err, result, fields) {
        if(result.length !== 0) done(err, result[0]);
    });
});

module.exports = passport;
  