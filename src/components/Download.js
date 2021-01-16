import React, { useEffect, useState } from "react";
import axios from "axios";
import download from "downloadjs";

const Download = (props) => {
    // const link = useRef(null);
    // const [file, setFile] = useState({});

    useEffect(() => {
        const id = props.match.params.id;
        axios
            .get(`http://localhost:5000/file/get/${id}`)
            .then((file) => {
                const folders = file.data.file_path.split("/");
                let filename = folders.pop();
                const lastUnderScore = filename.lastIndexOf("_");
                filename = filename.slice(lastUnderScore + 1);
                axios
                    .get(
                        `http://localhost:5000/file/download/${file.data._id}`,
                        {
                            responseType: "blob",
                        }
                    )
                    .then((file) => {
                        return download(
                            file.data,
                            filename,
                            file.file_mimetype
                        );
                    })
                    .then(() => window.history.go(-1))
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                if (err.message) {
                    alert("No such file is available in the server!");
                } else {
                    console.log(JSON.stringify(err));
                }
            });
    }, []);

    // const downloadLink = (id, path, mimetype) => {};

    // <a
    //     ref={link}
    //     href="#/"
    //     onClick={() =>
    //         downloadLink(file._id, file.file_path, file.file_mimetype)
    //     }>
    //     Download File
    // </a>;
    return <p>Downloading the file...</p>;
};

export default Download;
