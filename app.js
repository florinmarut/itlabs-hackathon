const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const md5 = require("md5");
const LocalStrategy = require("passport-local").Strategy;
const PORT = 3000;

app.use(express.static("dist"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"7EX9m841iWW2Yz",
    database:"testschema",
    multipleStatements: true
});

connection.connect((err) => {
    if(err){
        console.error('error connecting: ' + err.stack);
    } else{
        console.log('connected as id ' + connection.threadId);
    }
});


passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"}, (username, password, done) => {
    console.log("Inside local strategy");

    if(!username || !password){
        return done(null, false, {message: "Wrong username or password."});
    }

    const RETRIEVE_USER_QUERY = "SELECT * FROM `people` WHERE `email` = " + connection.escape(username);
    connection.query(RETRIEVE_USER_QUERY, (error, results, fields) => {
        if(error){
            return done(error);
        }
        if(!results.length){
            return done(null, false, {message: "Wrong username."});
        }

        if(!(md5(password) === results[0].password)){
            return done(null, false, {message: "Wrong password."});
        }
        return done(null, results[0]);
    })
}));

// passport.use(new LocalStrategy({usernameField: "email", passwordField: "password", passReqToCallback: true}, (username, password, done) => {
//     console.log("Inside local strategy");
//     const RETRIEVE_USER_QUERY = "SELECT * FROM `people` WHERE `email` = " + connection.escape(username);
//     connection.query(RETRIEVE_USER_QUERY, (error, results, fields) => {
//         if(error){
//             return done(error);
//         }
//         if(!results.length){
//             return done(null, false, {message: "Incorrect username."});
//         }
//         const RETRIEVE_PASSWORD_QUERY = "SELECT `password` FROM `people` WHERE `email` = " + connection.escape(username);
//         connection.query(RETRIEVE_PASSWORD_QUERY, (err, res, fie) => {
//             if(err){
//                 return done(err);
//             }
//             if(!res.length){
//                 return done(null, false, {message: "Incorrect password."});
//             }
//             bcrypt.compare(password, res[0].password, (e, r) => {
//                 if(e){
//                     return done(e);
//                 }
//                 if(!r){
//                     return done(null, false, {message: "Incorrect password."});
//                 }
//                 console.log("Welcome boss!");
//             })
//         });
//         console.log("Logged in!");
//         return done(null, results[0]);
//     })
// }));

passport.serializeUser((user, done) => {
    done(null, user.id);
 });
 
 passport.deserializeUser((id, done) => {
    connection.query("SELECT * FROM people WHERE id = "+ id, function (err, rows){
        done(err, rows[0]);
    });
 });


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + "/dist/about.html");
})

app.get("/event-details", (req, res) => {
    res.sendFile(__dirname + "/dist/details.html");
})

app.get("/contact", (req, res) => {
    res.sendFile(__dirname + "/dist/contact.html");
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/dist/login.html");
})

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/dist/register.html");
})

app.get("/register-alone", (req, res) => {
    res.sendFile(__dirname + "/dist/register-alone.html");
})

app.get("/register-team", (req, res) => {
    res.send("in development");
})

app.get("/profile", isAuthenticated, (req, res, next) => {
    res.send("In development...");
})

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

app.post("/register-alone", (req, res) => {
    const id = (Math.random() * 100) + 1;
    const firstName = req.body.fname;
    const lastName= req.body.lname;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const email = req.body.email;
    const password = req.body.password;

    const INSERT_QUERY = 'INSERT INTO people VALUES (' + connection.escape(id) + ', ' + 
    connection.escape(firstName) + ', ' + 
    connection.escape(lastName) + ', ' + 
    connection.escape(country) + ', ' +
    connection.escape(state) + ', ' +
    connection.escape(city) + ', ' +
    connection.escape(email) + ', ' + 
    connection.escape(md5(password)) + ')';

    connection.query(INSERT_QUERY, (err, results, fields) => {
    if(err){
        console.log(err);
        }else{
            console.log("Success at registration!");
        }
    })

    // bcrypt.hash(password, saltRounds, (err, hash) => {
    //     if(err){
    //         console.log(err);
    //     }else{
    //         const INSERT_QUERY = 'INSERT INTO people VALUES (' + connection.escape(id) + ', ' + 
    //         connection.escape(firstName) + ', ' + 
    //         connection.escape(lastName) + ', ' + 
    //         connection.escape(country) + ', ' +
    //         connection.escape(state) + ', ' +
    //         connection.escape(city) + ', ' +
    //         connection.escape(email) + ', ' + 
    //         connection.escape(hash) + ')';

    //         connection.query(INSERT_QUERY, (err, results, fields) => {
    //             if(err){
    //                console.log(err);
    //             }else{
    //                console.log("Success at registration!");
    //            }
    //         })
    //     }
    // });
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"}), (req, res) => {
})

app.listen(PORT, () => {console.log("Listening on port " + PORT)})