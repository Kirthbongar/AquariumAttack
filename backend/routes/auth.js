const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "15m"; //shore-lived access token
const REFRESH_EXPIRES_IN = "7d"; // Longer Refresh Token

//Register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email});
        if (existingUser) return res.status(400).json({msg: "Email already in use"});

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({email, passwordHash});
        await user.save();

        res.json({ msg: "User created"});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

//login
router.post("/login", async (req,res) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({ email});
        if (!user) return res.status(400).json({msg: "No Email Found"});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({msg: "Wrong Password"});

        const accessToken = jwt.sign({ id:user._id, roles: user.roles}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});
        const refreshToken = jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN});

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken});
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
    
});

//refresh token

router.post("/refresh-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({msg: "No refresh token"});

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({msg:"Invalid refresh token"});

        jwt.verify(refreshToken, JWT_SECRET,(err, decoded) => {
            if (err) return res.status(403).json({msg: "Invalid Secret Token"});
            const accessToken = jwt.sign({ id: user._id, roles: user.roles }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
            res.json({ accessToken});
        });
} catch (err) {
    res.status(500).json({ error:err.message});
}
});

router.post("/request-password-reset", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required"});

    try {
        const user = await User.findOne({ email});
        if (!user) return res.status(404).json({ msg: "User not found"});

        //generate token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; //1 hour
        await user.save();

        //send email?
        console.log(`Reset token for ${email}; ${token}`);

        res.json({ msg:"Password reset token generated. Check your email."});
    } catch (err){
        res.status(500).json({ error: err.message});
    }
});

//do the password reset

router.post("/reset-password", async (req, res) => {
    const { token, newPassword} = req.body;
    if (!token || !newPassword) return res.status(400).json({msg: "token and new password required"});

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now()},
        });

        if (!user) return res.status(400).json({msg: "invalid or expired token"});

        const bcrypt = require("bcrypt");
        user.passwordHash = await bcrypt.hash(newPassword, 10);

        // clear the reset token

        user.resetPasswordToken = undifined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: "password has been reset successfully"});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

module.exports= router;