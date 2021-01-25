const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, "./server-side/sent_files");
        },
        filename(req, file, cb) {
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

module.exports = upload;
