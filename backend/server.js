const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

//Middleware
const authMiddleware = require("./middleware/auth");
app.use(cors());
app.use(express.json()); //parse JSON bodies

//auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

//progress routes
const progressRoutes = require("./routes/progress");
app.use("/progress", progressRoutes);

//Simple Test route
app.get("/health", (req, res) => {
    res.json({ status: "Backend is running!"});
});

//Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Yes MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection Failed:",err.message);
    });
