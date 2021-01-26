import React, { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import download from "downloadjs";
import logo from "../stylesheets/logo.png";
import "../stylesheets/home.css";

const baseURL = process.env.BASE_URL || "http://localhost:5000";

const Home = () => {
    const dropRef = useRef(null);
    const submitBtn = useRef(null);
    const finalLinkRef = useRef(null);
    const previewImgRef = useRef(null);
    const shareBtnRef = useRef(null);
    const firstRender = useRef(true);

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

    const handleBtnClick = (e) => {
        shareBtnRef.current.style.background =
            "linear-gradient(315deg, #08a1c4 0%, #08cfbe 40%, rgb(2, 184, 117, 0.9) 100%)";
        shareBtnRef.current.style.color = "white";

        window.setTimeout(() => {
            shareBtnRef.current.style.background = "";
            shareBtnRef.current.style.color = "";
        }, 200);
        navigator.clipboard.writeText(
            `${baseURL}/file/download/${uploadedFile._id}`
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

    const downloadLink = (id, path, mimetype) => {
        const folders = path.split("/");
        let filename = folders.pop();
        const lastUnderScore = filename.lastIndexOf("__");
        filename = filename.slice(lastUnderScore + 2);
        axios
            .get(`${baseURL}/server/file/download/${id}`, {
                responseType: "blob",
            })
            .then((file) => {
                return download(file.data, filename, mimetype);
            })
            .catch((err) => console.error(err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitBtn.current.style.opacity = "0";
        if (file) {
            const formdata = new FormData();
            formdata.append("file", file);
            axios
                .post(`${baseURL}/server/file/`, formdata, {
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
                    if (!err.response) {
                        setErrorMsg(
                            "Please connect to the internet and try again."
                        );
                    } else {
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
                    }
                });
        } else {
            setErrorMsg("Please Select a File.");
        }
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
                                    Drag and Drop a File <br />
                                    or <br />
                                    Click Here to Select a File
                                </p>
                                {file.name ? (
                                    <div className="file-name">
                                        <strong style={{ fontWeight: "700" }}>
                                            Selected file:
                                        </strong>{" "}
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
                        <span></span>
                        Submit
                        <img className="submit-icon" src={logo} alt="logo" />
                        <span></span>
                    </button>
                ) : (
                    ""
                )}
            </form>

            {uploadedFile._id && displayLinks ? (
                <div className="final-links" ref={finalLinkRef}>
                    <button
                        className="link"
                        onClick={() =>
                            downloadLink(
                                uploadedFile._id,
                                uploadedFile.file_path,
                                uploadedFile.file_mimetype
                            )
                        }>
                        Download File
                        <i className="material-icons">file_download</i>
                    </button>
                    <button
                        className="share-link link"
                        onClick={handleBtnClick}
                        ref={shareBtnRef}
                        aria-label="Click to copy link">
                        <span></span> Share File
                        <i className="material-icons">share</i>
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
