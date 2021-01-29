import React, { useEffect } from "react";
import axios from "axios";
import download from "downloadjs";
import "../stylesheets/download.css";

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5000";
let frontURL = "";
if (baseURL === "http://localhost:5000") {
    frontURL = "http://localhost:3000";
}

const Download = (props) => {
    useEffect(() => {
        const id = props.match.params.id;
        axios
            .get(`${baseURL}/api/file/${id}`)
            .then((file) => {
                const downloadFile = file.data;
                download(
                    Uint8Array.from(downloadFile.data.Body.data).buffer,
                    downloadFile.file.file_name,
                    downloadFile.file.file_mimetype
                );
            })
            .then(() =>
                window.setTimeout(() => {
                    window.location.replace(frontURL || baseURL);
                }, 1000)
            )
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
