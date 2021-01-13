const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        file_path: { type: String, required: true, trim: true },
        file_mimetype: { type: String, required: true, trim: true },
        expire_at: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24 * 15, // Time to Line for the documents is set to 15 days after upload
        },
    },
    {
        timestamps: true,
    }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
