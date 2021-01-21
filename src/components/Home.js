import React, { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import download from "downloadjs";
import M from "materialize-css";
import "../stylesheets/home.css";

const Home = (props) => {
    const dropRef = useRef(null);
    const submitBtn = useRef(null);
    const finalLinkRef = useRef(null);
    const firstRender = useRef(true);
    const previewImgRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [file, setFile] = useState({});
    const [previewSrc, setPreviewSrc] = useState("");
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
    const [uploadedFile, setUploadedFile] = useState({});
    const [progress, setProgress] = useState(0);
    const [displayProgress, setDisplayProgress] = useState(false);
    const [displayLinks, setDisplayLinks] = useState(false);

    useEffect(() => {
        if (progress < 100 && displayProgress) {
            window.setTimeout(() => {
                setProgress(progress + 1);
            }, 50);
        } else {
            if (uploadedFile._id && progress >= 99) {
                window.setTimeout(() => {
                    setDisplayProgress(false);
                    setProgress(0);
                    setDisplayLinks(true);
                    window.setTimeout(() => {
                        finalLinkRef.current.style.opacity = "1";
                    }, 100);
                }, 1000);
            }
            if (progress !== 0 && !uploadedFile._id) {
                setProgress(99);
            }
        }
    }, [progress, displayProgress, uploadedFile]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        } else {
            if (isPreviewAvailable && previewSrc) {
                previewImgRef.current.style.opacity = "1";
            }
            if (!isPreviewAvailable && file.name) {
                dropRef.current.style.minHeight = "50vh";
                dropRef.current.style.border = "2px dashed #08a1c4";
                dropRef.current.style.background = "";
                dropRef.current.style.color = "";
            } else if (isPreviewAvailable && file.name) {
                dropRef.current.style.minHeight = "25vh";
                dropRef.current.style.border = "2px dashed #08a1c4";
                dropRef.current.style.background = "";
                dropRef.current.style.color = "";
            }
        }
    }, [isPreviewAvailable, previewSrc, file]);

    useEffect(() => {
        if (file.name) {
            setErrorMsg("");
            if (submitBtn.current) {
                submitBtn.current.style.visibility = "visible";
                submitBtn.current.style.opacity = "1";
            }
        }
    }, [file]);

    const updateBorder = (dragState) => {
        if (dragState === "over") {
            dropRef.current.style.border = "2px solid #02B875";
            dropRef.current.style.background =
                "linear-gradient(315deg, #08a1c4 0%, #08cfbe 40%, #02b875 100%)";
            dropRef.current.style.color = "white";
        } else if (dragState === "leave") {
            dropRef.current.style.border = "2px dashed #08a1c4";
            dropRef.current.style.background = "";
            dropRef.current.style.color = "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitBtn.current.style.opacity = "0";
        if (file) {
            const formdata = new FormData();
            formdata.append("file", file);
            axios
                .post("http://localhost:5000/file/", formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((file) => {
                    setUploadedFile({ ...file.data });
                    setErrorMsg("");
                    submitBtn.current.style.visibility = "hidden";
                    setDisplayProgress(true);
                })
                .catch((err) => {
                    const offlineError =
                        "Error: MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. Make sure your current IP address is on your Atlas cluster's IP whitelist: https://docs.atlas.mongodb.com/security-whitelist/";
                    const fileSizeError = "File too large";
                    if (err.response.data === offlineError)
                        setErrorMsg(
                            "Please connect to the internet and try again."
                        );
                    else if (err.response.data === fileSizeError)
                        setErrorMsg(
                            "File is too large. Please choose a file of size < 1 MB."
                        );
                    else setErrorMsg(err.response.data);
                });
        } else {
            setErrorMsg("Please Select a File.");
        }
    };

    const handleFile = (files) => {
        const [uploadedFile] = files;
        setFile(uploadedFile);
        setDisplayLinks(false);

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewSrc(fileReader.result);
        };
        fileReader.readAsDataURL(uploadedFile);

        setIsPreviewAvailable(
            uploadedFile.name.match(/\.(jpeg|jpg|png|webp|gif|svg)$/)
        );
    };

    const downloadLink = (id, path, mimetype) => {
        const folders = path.split("/");
        let filename = folders.pop();
        const lastUnderScore = filename.lastIndexOf("__");
        filename = filename.slice(lastUnderScore + 2);
        axios
            .get(`http://localhost:5000/file/download/${id}`, {
                responseType: "blob",
            })
            .then((file) => {
                return download(file.data, filename, mimetype);
            })
            .catch((err) => console.error(err));
    };

    const handleBtnClick = (e) => {
        navigator.clipboard.writeText(
            `http://localhost:3000/file/download/${uploadedFile._id}`
        );

        const toolTip = document.querySelector(
            "button.share-link .tooltiptext"
        );
        toolTip.style.visibility = "visible";
        toolTip.style.opacity = "1";

        window.setTimeout(() => {
            toolTip.style.visibility = "hidden";
            toolTip.style.opacity = "0";
        }, 5000);
    };

    return (
        <section className="home">
            <p className="error-msg">{errorMsg}</p>
            <form className="file-form" onSubmit={handleSubmit}>
                <section className="file-upload">
                    <Dropzone
                        onDrop={handleFile}
                        className="drop-file"
                        onDragEnter={() => updateBorder("over")}
                        onDragLeave={() => updateBorder("leave")}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                {...getRootProps({ className: "drop-zone" })}
                                ref={dropRef}>
                                <input {...getInputProps()} />
                                <p>
                                    Drag and drop a file OR click here to select
                                    a file
                                </p>
                                {file.name ? (
                                    <div className="file-name">
                                        <strong>Selected file:</strong>{" "}
                                        {file.name}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        )}
                    </Dropzone>

                    <div className="image-preview-message">
                        {previewSrc ? (
                            isPreviewAvailable ? (
                                <div className="image-preview">
                                    <img
                                        ref={previewImgRef}
                                        className="preview-image"
                                        src={previewSrc}
                                        alt="Preview"
                                    />
                                </div>
                            ) : (
                                <div className="preview-message">
                                    <p>No preview available for this file</p>
                                </div>
                            )
                        ) : (
                            <div className="preview-message">
                                <p>
                                    Image preview will be shown here after
                                    selection
                                </p>
                            </div>
                        )}
                    </div>
                    {progress > 0 ? (
                        <div className="progress">
                            <div
                                className="determinate"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </section>

                {file.name && !displayLinks ? (
                    <button
                        ref={submitBtn}
                        className="submit-btn"
                        type="submit">
                        Submit
                    </button>
                ) : (
                    ""
                )}
            </form>

            {uploadedFile._id && displayLinks ? (
                <div className="final-links" ref={finalLinkRef}>
                    <a
                        href="#/"
                        title="Download the file"
                        className="link"
                        onClick={() =>
                            downloadLink(
                                uploadedFile._id,
                                uploadedFile.file_path,
                                uploadedFile.file_mimetype
                            )
                        }>
                        Download File
                    </a>{" "}
                    <button
                        className="share-link link"
                        onClick={handleBtnClick}
                        title="Copy link to clipboard"
                        aria-label="Click to copy link">
                        Share File
                        <span className="tooltiptext">Link Copied!</span>
                    </button>
                </div>
            ) : (
                ""
            )}
        </section>
    );
};

export default Home;
