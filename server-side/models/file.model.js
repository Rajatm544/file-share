const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// The schema for the file model
const fileSchema = new Schema(
    {
        file_key: { type: String, required: true, trim: true }, // The file key after S3 file upload is done
        file_mimetype: { type: String, required: true, trim: true }, // The mimetype helps download the correct filetype later
        file_location: { type: String, required: true, trim: true }, // The URL to download the file, provided after AWS S3 file upload is done
        file_name: { type: String, required: true, trim: true }, // The original name of the file that has been uploaded, without the date-time prefix
    },
    {
        timestamps: true,
    }
);

// Set the Time-to-Live to be 15 days, to potentially save space in the mongoDB database
fileSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 15 });
const File = mongoose.model("File", fileSchema);

module.exports = File;
