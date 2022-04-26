const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const con = require('./db_config');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var crypt_password = 'd6F3Efeq';

passport.use(new LocalStrategy(
    {
        passReqToCallback: true
    },
    function(req, username, password, done) {
        const type = req.query.type.toLocaleLowerCase();

        var cipher = crypto.createCipher(algorithm, crypt_password)
        var crypted = cipher.update(password,'utf8','hex')
        crypted += cipher.final('hex');
        console.log(password, crypted)

        const sql_query = type === "database_manager" ?
        `
            SELECT * FROM Database_Manager
            WHERE username = "${username}" AND password = "${password}"
        ` :
        `
            SELECT * 
            FROM User
            WHERE username = "${username}" AND password = "${crypted}" AND 
            username IN(SELECT username FROM ${type})
        `;

        console.log(sql_query)

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
    const type = (user.title || user.name) ? "user" : "database_manager"
    done(null, {username: user.username, type}); 
});

// used to deserialize the user
passport.deserializeUser(function(info, done) {
    const sql_query = `
        SELECT * FROM ${info.type}
        WHERE username = "${info.username}"`;

    con.query(sql_query, function (err, result, fields) {
        if(result.length !== 0) done(err, result[0]);
    });
});

module.exports = passport;
  