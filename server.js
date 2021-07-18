const express = require("express");
const connectDB = require("./config/db");
var cors = require("cors");

const app = express();

//connect to database
connectDB();

//init middleware
app.use(cors());
// enable cors

app.use(express.json({ extended: false }));

// This option allows to choose between parsing the URL-encoded data with the querystring library
// (when false) or the qs library (when true). The “extended”
// syntax allows for rich objects and arrays to be encoded into the URL-encoded format,
// allowing for a JSON-like experience with URL-encoded.

// local development server
app.get("/", (req, res) => res.send("API RUNNING"));

// define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
