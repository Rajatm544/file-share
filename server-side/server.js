const express = require("express"); // express framework to build the application
const mongoose = require("mongoose"); //  mongoose ODM to handle mongoDB documents
const cors = require("cors"); // package to avoid CORS errors
const path = require("path"); // to handle static files' path to help deploy the app to heroku
require("dotenv").config(); // package to handle the environment vars

// configure the express app to use JSON and CORS()
const app = express();
app.use(cors());
app.use(express.json());

// configure the port for the server side
const PORT = process.env.PORT || 5000;

// configure the mongoose setup
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection has been established");
});

// configure the routes
const fileRouter = require("./routes/file.route");
app.use("/api/file", fileRouter);

//Load the npm build package of the frontend CRA
if (process.env.NODE_ENV === "production") {
    // set a static folder
    app.use(express.static("build"));

    // Provide a wildcard as a fallback for all routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../build", "index.html"));
    });
}

// host the app on port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
