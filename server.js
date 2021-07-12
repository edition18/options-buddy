const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect to database
connectDB();

// local development server
app.get("/", (req, res) => res.send("API RUNNING"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
