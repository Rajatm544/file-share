const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        file_path: { type: String, required: true, trim: true },
        file_mimetype: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    }
);

fileSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 7 });
const File = mongoose.model("File", fileSchema);

module.exports = File;
