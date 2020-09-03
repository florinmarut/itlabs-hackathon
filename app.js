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

app.get("/profile", isAuthenticated, (req, res, next) => {
    res.sendFile(__dirname + "/dist/profile.html");
})

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

app.get("/partners", (req, res) => {
    res.sendFile(__dirname + "/dist/partners.html");
})

app.post("/register", (req, res) => {
    const firstName = req.body.fname;
    const lastName= req.body.lname;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmPassword;

    const CHECK_IF_USER_REGISTERED_QUERY = "SELECT * FROM `people` WHERE `email` = " + connection.escape(email);
    connection.query(CHECK_IF_USER_REGISTERED_QUERY, (error, results, fields) => {
        if(error){
            console.log(error);
        }else{
            if(!results.length){
                console.log("User doesn't exist, registering...");
                if(password === confirmedPassword){
                    const INSERT_QUERY = 'INSERT INTO people (firstname, lastname, country, state, city, phone, email, password) VALUES (' +
                    connection.escape(firstName) + ', ' + 
                    connection.escape(lastName) + ', ' + 
                    connection.escape(country) + ', ' +
                    connection.escape(state) + ', ' +
                    connection.escape(city) + ', ' +
                    connection.escape(phone) + ', ' +
                    connection.escape(email) + ', ' + 
                    connection.escape(md5(password)) + ')';
            
                    connection.query(INSERT_QUERY, (err, results, fields) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Success at registration!");
                    }
                })
                } else{
                    console.log("Passwords don't match or user already exists");
                }
            }else{
                console.log("User exists");
            }
        }
    });
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"}), (req, res) => {
})

app.listen(PORT, () => {console.log("Listening on port " + PORT)})