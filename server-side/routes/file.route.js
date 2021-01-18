const router = require("express").Router();
const upload = require("../multer/upload");
const path = require("path");
let File = require("../models/file.model");

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
        console.log(req.file);
        const { title, description } = req.body;
        const { path, mimetype } = req.file;

        const file = new File({
            title,
            description,
            file_path: path,
            file_mimetype: mimetype,
        });

        file.save()
            .then(() => {
                File.findOne({}, {}, { sort: { created_at: -1 } })
                    .then((file) => res.json(file))
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

router.get("/get/:id", (req, res) => {
    File.findById(req.params.id)
        .then((file) => res.json(file))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/download/:id", (req, res) => {
    try {
        File.findById(req.params.id)
            .then((file) => {
                res.set({
                    "Content-Type": file.file_mimetype,
                });
                res.sendFile(path.join(__dirname, "../..", file.file_path));
            })
            .catch((err) => res.status(400).json(`Error: ${err}`));
    } catch (error) {
        if (error)
            res.status(500).send(
                "Error while fetching this file. Please try again later."
            );
    }
});

router.delete("/", (req, res) => {
    File.deleteMany({}).then(() => res.json("All files deleted"));
});

module.exports = router;
