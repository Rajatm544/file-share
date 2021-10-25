const router = require("express").Router(); // to handle express routes
const multer = require("multer"); // to handle file uploads in Node.js
const aws = require("aws-sdk"); // to connect to the S3 bucket, we use the aws-sdk
const multerS3 = require("multer-s3"); // to help deal with file upload to the S3 bucket
let File = require("../models/file.model"); // The file model to create new models

// Create a new instance of the S3 bucket object with the correct user credentials
const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    Bucket: "easysharebucket",
});

// Setup the congifuration needed to use multer
const upload = multer({
    // Use the following block of code to store the files in local storage on file upload

    // storage: multer.diskStorage({
    //     destination(req, file, cb) {
    //         cb(null, "./server-side/sent_files");
    //     },
    //     filename(req, file, cb) {
    //         cb(null, `${new Date().getTime()}__${file.originalname}`);
    //     },
    // }),

    // Set the storage as the S3 bucker using the correct configuration
    storage: multerS3({
        s3,
        acl: "public-read", // public S3 object, that can be read
        bucket: "easysharebucket", // bucket name
        key: function (req, file, cb) {
            // callback to name the file object in the S3 bucket
            // The filename is prefixed with the current time, to avoid multiple files of same name being uploaded to the bucket
            cb(null, `${new Date().getTime()}__${file.originalname}`);
        },
    }),
    limits: {
        fileSize: 5000000, // maximum file size of 5 MB per file
    },

    // Configure the list of file types that are valid
    fileFilter(req, file, cb) {
        if (
            !file.originalname.match(
                /\.(jpeg|jpg|png|webp|gif|pdf|doc|docx|xls|xlsx|svg|ppt|pptx)$/
            )
        ) {
            return cb(
                new Error(
                    "Unsupported file format, please choose a different file and retry."
                )
            );
        }
        cb(undefined, true); // continue with file upload without errors
    },
});

// // Root Route to get all the files in the reverse chronological order of file upload time
// router.get("/", (req, res) => {
//     try {
//         File.find()
//             .then(
//                 (files) =>
//                     res.json(files.sort((a, b) => b.createdAt - a.createdAt)) // sort in reverse chronological order
//             )
//             .catch((err) => res.status(400).json(`Error: ${err}`));
//     } catch (error) {
//         if (error) res.status(500).json(error.message);
//     }
// });

// Route to upload new file
router.post(
    "/",

    // use the multer configured 'upload' object as middleware, setup a single file upload
    upload.single("file"),

    // After the multer module takes care of uploading the file to the S3 bucket, create the corresponding DB document with required fields
    (req, res) => {
        const { key, mimetype, location } = req.file;
        const lastUnderScore = key.lastIndexOf("__");
        const file_name = key.slice(lastUnderScore + 2);
        const file = new File({
            file_key: key,
            file_mimetype: mimetype,
            file_location: location,
            file_name,
        });

        // Upon succefully saving the file object in the DB, return the created object
        file.save()
            .then(() => {
                File.findOne({ file_key: key })
                    .then((file) => {
                        res.json(file);
                    })
                    .catch((err) => res.status(400).send(`Error: ${err}`));
            })
            .catch((err) => res.status(400).json(`Error: ${err}`));
    },
    (error, req, res, next) => {
        if (error) {
            res.status(500).send(error.message);
        }
    }
);

// Route to get a particular file object from the DB
router.get("/:id", (req, res) => {
    File.findById(req.params.id)
        .then((file) => {
            // Set the response content type to be the file's mimetype to avoid issues with blob type response
            res.set({
                "Content-Type": file.file_mimetype,
            });

            // The params are required to access objects from the S3 bucket
            const params = {
                Key: file.file_key,
                Bucket: "easysharebucket",
            };

            // get the correct S3 object using the File object fetched from the DB
            s3.getObject(params, (err, data) => {
                if (err) {
                    res.status(400).json(`Error: ${err}`);
                } else {
                    // return the file object from the DB, as well as the actual file data in the form of a buffer array from the S3 object
                    res.json({ file, data });
                }
            });
        })
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

// route to delete all the files from the DB, not from the S3 bucket
router.delete("/", (req, res) => {
    File.deleteMany({}).then(() => res.json("All files deleted"));
});

// return the router with all the configured routes
module.exports = router;
