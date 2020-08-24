const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("dist"));

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

app.listen(PORT, () => {console.log("Listening on port " + PORT)})