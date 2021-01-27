const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// configure the express app
const app = express();
app.use(cors());
app.use(express.json());

// configure the port for the server side
const PORT =
    process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 5000;

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
app.use("/server/file", fileRouter);

// host the app on port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
