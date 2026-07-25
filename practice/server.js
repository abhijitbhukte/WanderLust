const express = require("express");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");


app.use(session({secret: "secretstring",resave: false, saveUninitialized: true}));
app.use(flash());


app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    res.redirect("/hello");
});


app.get("/hello", (req, res) => {
    res.send(`hello ${req.session.name}`);
});


// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You sent the request ${req.session.count} times`)
// });




app.listen(3000, () => {
    console.log("Connection Successfully");
});