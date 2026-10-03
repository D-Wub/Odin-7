require("dotenv").config();
const express = require('express');
const session = require("express-session");
const path = require("node:path");
const passport = require("./config/passport");

const app = express();

const projectRouter = require('./routes/projectRouter');

const assetsPath = path.join(__dirname, "public");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(assetsPath));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.session());

/* Didn't use
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
*/

app.use('/', projectRouter);

// Centralized error handler (Must have exactly 4 arguments and be at bottom below routes)
app.use((err, req, res, next) => {
    console.error("Global error catch:", err.stack);
    res.status(500).send("An error has occurred:<br>" + err.stack);
}); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Members Only App - listening on port ${PORT}! Click http://localhost:${PORT}/ to view.`);
});