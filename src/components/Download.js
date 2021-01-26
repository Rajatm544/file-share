import React, { useEffect } from "react";
import axios from "axios";
import download from "downloadjs";
import "../stylesheets/download.css";

const baseURL = process.env.BASE_URL || "http://localhost:5000";
let frontURL = "";
if (baseURL === "http://localhost:5000") {
    frontURL = "http://localhost:3000";
}

const Download = (props) => {
    useEffect(() => {
        const id = props.match.params.id;
        axios
            .get(`${baseURL}/server/file/get/${id}`)
            .then((file) => {
                const folders = file.data.file_path.split("/");
                let filename = folders.pop();
                const lastUnderScore = filename.lastIndexOf("__");
                filename = filename.slice(lastUnderScore + 2);
                axios
                    .get(`${baseURL}/server/file/download/${file.data._id}`, {
                        responseType: "blob",
                    })
                    .then((file) => {
                        return download(
                            file.data,
                            filename,
                            file.file_mimetype
                        );
                    })
                    .then(() =>
                        window.setTimeout(() => {
                            window.location.replace(frontURL || baseURL);
                        }, 1000)
                    )
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                if (err.message) {
                    alert("No such file is available in the server!");
                    window.location.replace(baseURL || frontURL);
                } else {
                    console.log(JSON.stringify(err));
                }
            });
    }, []);
    return <p className="prompt">Downloading the file...</p>;
};

export default Download;
