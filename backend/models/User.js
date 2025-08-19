const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ["player"]},
    refreshToken: { type: String },
    createdAt: {type: Date, default: Date.now },

    // Password reset fields
    resetPasswordToken: {type: String},
    resetPasswordExpires: { type: Date},
});

module.exports = mongoose.model("User", userSchema);