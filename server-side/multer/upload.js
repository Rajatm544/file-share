const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, "./server-side/sent_files");
        },
        filename(req, file, cb) {
            cb(null, `${new Date().getTime()}_${file.originalname}`);
        },
    }),
    limits: {
        fileSize: 1000000, // maximum file size of 1 MB
    },
    fileFilter(req, file, cb) {
        if (
            !file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xls|xlsx)$/)
        ) {
            return cb(
                new Error(
                    "supported file formats are jpg, jpeg, png, pdf, doc, docx, xslx, xls. Retry Once Again."
                )
            );
        }
        cb(undefined, true); // continue with upload
    },
});

module.exports = upload;
