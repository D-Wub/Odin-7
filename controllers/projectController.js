const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.renderIndex = async (req, res, next) => {
    try {
        const messages = await db.getMessages();
        const filteredMessages = messages.map(message => {
            const formattedDate = new Date(message.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

            if (req.user?.member) {
                return { ...message, formattedDate};
            }
            return {
                message_id: message.message_id,
                title: message.title,
                content: message.content,
                username: message.username
            };
        });
        
        const alerts = {
            member: req.session.alert
        };

        //Clear the alert after reading it
        delete req.session.alert;

        res.render("index", { user: req.user, messages: filteredMessages, alerts });
    } catch (error) {
        next(error);
    }
};


exports.renderSignUp = (req, res) => {
    res.render("sign-up", { errors: [], formData: {} });
}

exports.renderMemberSignUp = (req, res) => {
    res.render("member-sign-up", { errors: [] });
}

exports.renderAdminSignUp = (req, res) => {
    res.render("admin-sign-up", { errors: [] });
}

exports.renderLogin = (req, res) => {
    res.render("login", { error: null, formData: {} });
}

exports.renderCreate = (req, res) => {
    res.render("create", { errors: [], formData: {} });
}

exports.signUpUser = async (req, res, next) => {
    const { username, password, first_name, last_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser(username, hashedPassword, first_name, last_name);
        res.redirect("/");
    } catch (error) {
        if (error.code === "23505") { // PostgreSql duplicate key
            return res.status(400).render("sign-up", {
                errors: [
                    { msg: "Username is already taken." }
                ],
                formData: req.body
            });
        }

        next(error);
    }
}

exports.loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).render("login", {
                error: info?.message || "Login failed.",
                formData: req.body
            });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            res.redirect("/");
        });
    })(req, res, next);
}

exports.memberSignUpUser = async (req, res, next) => {
    try {
        const { memberPassword } = req.body;

        if (!memberPassword) {
            return res.status(400).render("member-sign-up", { errors: [{ msg: "Membership password is required." }] })
        }

        if (memberPassword !== process.env.MEMBER_PASSWORD) {
            return res.status(403).render("member-sign-up", { errors: [{ msg: "Incorrect membership password." }] })
        }

        await db.promoteUser(req.user.id);
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};


exports.adminSignUpUser = async (req, res, next) => {
    try {
        const { adminPassword } = req.body;

        if (!adminPassword) {
            return res.status(400).render("admin-sign-up", { errors: [{ msg: "Administration password is required." }] })
        }

        if (adminPassword !== process.env.ADMIN_PASSWORD) {
            return res.status(403).render("admin-sign-up", { errors: [{ msg: "Incorrect administration password." }] })
        }

        await db.promoteMember(req.user.id);
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

exports.postMessage = async (req, res, next) => {
    const {title, content} = req.body;
    const user_id = req.user.id;

    try {
        await db.createMessage(title, content, user_id);
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

exports.deleteMessage = async (req, res, next) => {
    const { message_id } = req.body;
    try {
        await db.deleteUserMessage(message_id)
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}