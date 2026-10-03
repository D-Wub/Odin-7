const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

passport.use(
    new LocalStrategy(async (username, password, done) => {
    try {
        const user = await db.getUserByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, {
            message: "Incorrect username or password",
            });
        }
        return done(null, user);
    } catch(error) {
        return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    //Treats user as unauthorized
    if (!user) {
      return done(null, false);
    }
    //Retrieves user successfully
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;