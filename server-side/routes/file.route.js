const router = require("express").Router();
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
let File = require("../models/file.model");

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    Bucket: "easysharebucket",
});

const upload = multer({
    // storage: multer.diskStorage({
    //     destination(req, file, cb) {
    //         cb(null, "./server-side/sent_files");
    //     },
    //     filename(req, file, cb) {
    //         cb(null, `${new Date().getTime()}__${file.originalname}`);
    //     },
    // }),
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "easysharebucket",
        key: function (req, file, cb) {
            cb(null, `${new Date().getTime()}__${file.originalname}`);
        },
    }),
    limits: {
        fileSize: 1000000, // maximum file size of 1 MB
    },
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
        cb(undefined, true); // continue with upload
    },
});

// Root Route
router.get("/", (req, res) => {
    try {
        File.find()
            .then(
                (files) =>
                    res.json(files.sort((a, b) => b.createdAt - a.createdAt)) // sort in reverse chronological order
            )
            .catch((err) => res.status(400).json(`Error: ${err}`));
    } catch (error) {
        if (error) res.status(500).json(error.message);
    }
});

// Route to create new file upload
router.post(
    "/",
    upload.single("file"),
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

router.get("/:id", (req, res) => {
    File.findById(req.params.id)
        .then((file) => {
            res.set({
                "Content-Type": file.file_mimetype,
            });
            const params = {
                Key: file.file_key,
                Bucket: "easysharebucket",
            };
            s3.getObject(params, (err, data) => {
                if (err) {
                    res.status(400).json(`Error: ${err}`);
                } else {
                    res.json({ file, data });
                }
            });
        })
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/", (req, res) => {
    File.deleteMany({}).then(() => res.json("All files deleted"));
});

module.exports = router;
