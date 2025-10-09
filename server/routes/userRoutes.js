const express = require("express");
const router = express.Router();
const cors = require("cors");
const userController = require("../controllers/userController");

router.post("/signup", userController.signUpUser);
router.post("/login", userController.loginUser);

module.exports = router;