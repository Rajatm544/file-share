import React, { useEffect } from "react";
import axios from "axios";
import download from "downloadjs"; // package to trigger file downloads on the clientside
import "../stylesheets/download.css";

// configure the baseURL to be either the localhost or the deployed URL
const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5000";
let frontURL = "";
if (baseURL === "http://localhost:5000") {
    frontURL = "http://localhost:3000";
}

// component to handle file downloads after user clicks on the shareable link
const Download = (props) => {
    // trigger the file download after the component has mounted
    useEffect(() => {
        // fetch the _id of the File(from DB) from the params
        const id = props.match.params.id;

        // Get the data for the correct file object using the id
        axios
            .get(`${baseURL}/api/file/${id}`)
            .then((file) => {
                const downloadFile = file.data; // the buffer array that holds the content of the file

                // invoke the download function to download the file
                download(
                    Uint8Array.from(downloadFile.data.Body.data).buffer, // convert the buffer array to uint8array, to be compliant with the downloadjs function property type
                    downloadFile.file.file_name, // name of the file to be downloaded, is set to the original file name stored in the DB
                    downloadFile.file.file_mimetype // the valid mime type of the file to be downloaded
                );
            })
            .then(() =>
                // wait for a second to finish file download, and then redirect to the home page of the application
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
    return <p className="prompt">Downloading the file...</p>; // display a message while the file download starts
};

export default Download;
