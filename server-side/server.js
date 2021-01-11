const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

// configure the express app
const app = express();
app.use(cors());
app.use(express.json());

// configure the port for the server side
const PORT = process.env.PORT || 5000;

// host the app on port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
