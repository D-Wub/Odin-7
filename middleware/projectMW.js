const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.validateSignUp = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),

    body("confirm_password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match.");
            }
            return true;
        }),

    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required.")
        .isLength({ max: 50 })
        .withMessage("First name must be 50 characters or fewer."),

    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required.")
        .isLength({ max: 50 })
        .withMessage("Last name must be 50 characters or fewer."),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up", {
                errors: errors.array(),
                formData: req.body
            });
        }

        next();
    }
];

exports.validatePost = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Title must be between 3 and 50 characters."),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ max: 3000 })
    .withMessage("Content must be 3000 characters or fewer."),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("create", {
                errors: errors.array(),
                formData: req.body
            });
        }

        next();
    },
];

exports.logOutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

exports.requireLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
};

exports.requireMember = (req, res, next) => {
    if (req.user && req.user.member === true) {
        return next();
    }

    req.session.alert = 'Members Only';
    res.redirect("/");
};

exports.requireAdmin = (req, res, next) => {
    if (req.user && req.user.admin === true) {
        return next();
    }

    res.redirect("/");
};