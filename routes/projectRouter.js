const { Router } = require("express");
const projectRouter = Router();

const {
    renderIndex,
    renderSignUp,
    renderLogin,
    renderMemberSignUp,
    renderAdminSignUp,
    renderCreate,
    signUpUser,
    loginUser,
    memberSignUpUser,
    adminSignUpUser,
    postMessage,
    deleteMessage
} = require("../controllers/projectController");

const {
    validateSignUp,
    logOutUser,
    validatePost,
    requireLoggedIn,
    requireMember,
    requireAdmin
} = require("../middleware/projectMW");

projectRouter.get("/", renderIndex);
projectRouter.get("/sign-up", renderSignUp);
projectRouter.get("/login", renderLogin);
projectRouter.get("/member-sign-up", requireLoggedIn, renderMemberSignUp);
projectRouter.get("/admin-sign-up", requireMember, renderAdminSignUp);
projectRouter.get("/create", requireLoggedIn, renderCreate);
projectRouter.get("/logout", logOutUser);

projectRouter.post("/sign-up", validateSignUp, signUpUser);
projectRouter.post("/login", loginUser);
projectRouter.post("/member-sign-up", requireLoggedIn, memberSignUpUser);
projectRouter.post("/admin-sign-up", requireMember, adminSignUpUser);
projectRouter.post("/create", requireLoggedIn, validatePost, postMessage);

projectRouter.post("/delete", requireAdmin, deleteMessage);

module.exports = projectRouter;