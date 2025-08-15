const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

//example protected route
router.get("/me", authMiddleware, (req, res) => {
    res.json({msg: "You are authorized!", user: req.user});
});

module.exports =router;