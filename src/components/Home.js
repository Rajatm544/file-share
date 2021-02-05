import React, { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone"; // package to handle file drag-and-drop
import axios from "axios";
import download from "downloadjs"; // package to trigger file download
import logo from "../stylesheets/logo.png";
import "../stylesheets/home.css";

// set the base URL as the localhost or the deployed URL
const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:5000";
let frontURL = "";
if (baseURL === "http://localhost:5000") {
    frontURL = "http://localhost:3000";
}

// Home Page's component
const Home = () => {
    // Set the opacity to 1 after component mounting

    // Refs to handle the UI of the page
    const dropRef = useRef(null); // Drag-and-drop component's reference
    const submitBtn = useRef(null); // Submit button's reference
    const finalLinkRef = useRef(null); // Reference to the links displayed after file upload is done successfully
    const previewImgRef = useRef(null); // Reference to the preview image component
    const shareBtnRef = useRef(null); // Reference to the button that copies shareable link to the clipboard, after successful file upload
    const homeRef = useRef(null);
    const firstRender = useRef(true); // Reference to prevent a useEffect block from executing on componentDidMount/first render

    // All the state variables
    const [errorMsg, setErrorMsg] = useState(""); // To store any error message in the file upload process
    const [file, setFile] = useState({}); // To store the file object after the drag-and-drop event occurs
    const [previewSrc, setPreviewSrc] = useState(""); // To store the image to be previewed after file upload
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // To set a boolean variable to check if preview is available or not
    const [uploadedFile, setUploadedFile] = useState({}); // To store the File object returned after POST request is made to the server
    const [progress, setProgress] = useState(0); // To set the progress bar's width/percentage
    const [displayProgress, setDisplayProgress] = useState(false); // Bolean variable to display the progress bar during file upload process
    const [displayLinks, setDisplayLinks] = useState(false); // Boolean var to display the links (to download/copy shareable link) after successful file upload

    useEffect(() => {
        homeRef.current.style.opacity = "1";
    }, []);

    // UseEffect to handle how the progress bar works
    useEffect(() => {
        // To display the progress bar's percentage being increased gradually, during the file upload process
        if (progress < 100 && displayProgress) {
            // A setTimeout is used to avoid the 'progress' state var being changes too many times, and crashing the app because the max call-stack of react render is reached
            window.setTimeout(() => {
                setProgress(progress + 2);
            }, 100);
        }
        // If the progress bar is about to reach 100% but the file upload has returned the uploadedFile object
        else if (uploadedFile.file && progress >= 99) {
            // setTimeout is used to fadeout the progress bar and to fade-in the final links
            window.setTimeout(() => {
                setDisplayProgress(false); // stop displaying the progress bar
                setProgress(0); // set the width of the progress bar to 0
                setDisplayLinks(true); // display the final links to download the file/copy th shareable link to clipboard

                // Give time for the CSS transition to occur
                window.setTimeout(() => {
                    finalLinkRef.current.style.opacity = "1";
                }, 100);
            }, 1000);
        }
        // In case the progress bar is about to reach 100%, but the file upload hasn't been completed successfuly yet
        // then keep the progress bar at 99%, as long as the uploadedFile object has a 'file' key that holds the correct data for the uploaded file
        else if (progress !== 0 && !uploadedFile.file) setProgress(99);
    }, [progress, displayProgress, uploadedFile]);

    // useEffect to handle the style changes to the drag-and-drop section, upon file being being selected using it
    useEffect(() => {
        // Do not execute this on first render
        if (firstRender.current) {
            firstRender.current = false;
            return;
        } else {
            // if the file selected is an image, then display its preview
            if (isPreviewAvailable && previewSrc) {
                previewImgRef.current.style.opacity = "1";
            }
            // if the file selected is not an image, then keep the height of the drag-and-drop section to be 50vh itself
            if (!isPreviewAvailable && file.name)
                dropRef.current.style.minHeight = "50vh";
            // if the file selected is an image, then reduce height of the drag-and-drop section to be 25vh
            else if (isPreviewAvailable && file.name)
                dropRef.current.style.minHeight = "25vh";

            // remove any extra styles added to it during drag event
            dropRef.current.style.border = "2px dashed #08a1c4";
            dropRef.current.style.background = "";
            dropRef.current.style.color = "";
        }
    }, [isPreviewAvailable, previewSrc, file]);

    // useEffect to handle when the submit button is displayed
    useEffect(() => {
        // If a file has been selected using the drag-and-drop component, then display the submit button
        if (file.name) {
            setErrorMsg(""); // if file is a valid mimetype, then remove any error messages displayed with a previous file selection of an unsupported mime type
            if (submitBtn.current) {
                submitBtn.current.style.visibility = "visible";
                submitBtn.current.style.opacity = "1";
            }
        }
    }, [file]);

    // function to update the style of the drag-and-drop component on mouseover and mouseleave
    const updateBorder = (dragState) => {
        // If the user hovers over the section, to drop a file, make the following changes to the style
        if (dragState === "over") {
            dropRef.current.style.border = "2px solid #02B875";
            dropRef.current.style.background =
                "linear-gradient(315deg, #08a1c4 0%, #08cfbe 40%, #02b875 100%)";
            dropRef.current.style.color = "white";
        }
        // Once the file has been dropped, and the cursor leaves the drop-section, then remove the style changes made in the previous block
        else if (dragState === "leave") {
            dropRef.current.style.border = "2px dashed #08a1c4";
            dropRef.current.style.background = "";
            dropRef.current.style.color = "";
        }
    };

    // function to handle file selection using the drag-and-drop section
    const handleFile = (files) => {
        // fetch the file to be uploaded, from the argument 'files' and set it to the correct state variable
        const [uploadedFile] = files;
        setFile(uploadedFile);
        setDisplayLinks(false); // do not display the final links yet. Useful when user attempts consecutive file uploads

        // set the preview image if the file type is an image type
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewSrc(fileReader.result);
        };
        fileReader.readAsDataURL(uploadedFile);

        setIsPreviewAvailable(
            uploadedFile.name.match(/\.(jpeg|jpg|png|webp|gif|svg)$/)
        );
    };

    // function to handle events after the link to share the file, is clicked
    const handleBtnClick = (e) => {
        // change the background style and color of the button
        shareBtnRef.current.style.background =
            "linear-gradient(315deg, #08a1c4 0%, #08cfbe 40%, rgb(2, 184, 117, 0.9) 100%)";
        shareBtnRef.current.style.color = "white";

        // to make it seem as though there was a click of the button, remove additional styles for 200ms
        window.setTimeout(() => {
            shareBtnRef.current.style.background = "";
            shareBtnRef.current.style.color = "";
        }, 200);

        // copy the correct shareable link to the clipboard
        navigator.clipboard.writeText(
            `${frontURL || baseURL}/download/${uploadedFile.file._id}`
        );

        // Display the tool tip that says 'link copied'
        const toolTip = document.querySelector(
            "button.share-link .tooltiptext"
        );
        toolTip.style.visibility = "visible";
        toolTip.style.opacity = "1";

        // remove the tooltip from DOM after 5s
        window.setTimeout(() => {
            toolTip.style.visibility = "hidden";
            toolTip.style.opacity = "0";
        }, 5000);
    };

    // function to handle file submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // stop displaying the submit button
        submitBtn.current.style.opacity = "0";

        // if the valid filetype has been selected and set as the state var
        if (file) {
            // create a new FormData and append the file with the key 'file', as this is the key that multer has been configured to look for
            const formdata = new FormData();
            formdata.append("file", file);

            // Wait for CSS transition to occur before displaying the progrss bar
            window.setTimeout(() => {
                setDisplayProgress(true);
            }, 500);

            // make POST request to the server API with the headers needed to work with files/form-data
            axios
                .post(`${baseURL}/api/file/`, formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((file) => {
                    // Once the POST request occurs succesfully, the returned object includes the File object stored in the DB
                    setErrorMsg(""); // remove any error messages
                    submitBtn.current.style.visibility = "hidden";

                    // Make GET request to obtain the data for the buffer array of the required file
                    axios
                        .get(`${baseURL}/api/file/${file.data._id}`)
                        .then((uploadedFile) => {
                            setDisplayLinks(true); // once the file data is obtained, display the final links
                            setUploadedFile(uploadedFile.data);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    // In case there was an error but no response is sent from the server API, it means there was an internet issue
                    if (!err.response) {
                        setErrorMsg(
                            "Please connect to the internet and try again."
                        );
                    }
                    // Check the error response and set the appropriate error message to be displayed to the user
                    else {
                        const offlineError =
                            "Error: MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. Make sure your current IP address is on your Atlas cluster's IP whitelist: https://docs.atlas.mongodb.com/security-whitelist/";
                        const fileSizeError = "File too large";
                        if (err.response.data === offlineError)
                            setErrorMsg(
                                "Please connect to the internet and retry."
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
        <section ref={homeRef} className="home">
            {/* display any error message if it's there */}
            <p className="error-msg">{errorMsg}</p>

            {/* the drag-and-drop section */}
            <form className="file-form" onSubmit={handleSubmit}>
                <section className="file-upload">
                    <Dropzone
                        onDrop={handleFile}
                        className="drop-file"
                        // update the style of the section on file selection
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

                                {/* display the name of the selected file */}
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

                    {/* display any preview image or a message to say image preview isn't available */}
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

                    {/* display the progress bar */}
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

                {/* display the submit button after file selection */}
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

            {/* display the links to download the file/ copy link for sharing the file, after successful file upload */}
            {displayLinks ? (
                <div className="final-links" ref={finalLinkRef}>
                    {/* onclicking the download button, use the dowbloadjs function to trigger the file download */}
                    <button
                        className="link"
                        onClick={() =>
                            download(
                                Uint8Array.from(uploadedFile.data.Body.data) // converting the buffer array to a uint8array, to be compliant with the downloadjs function requirement
                                    .buffer,
                                uploadedFile.file.file_name,
                                uploadedFile.file.file_mimetype
                            )
                        }>
                        Download File
                        <i className="material-icons">file_download</i>
                    </button>

                    {/* copy link to clipboard once this link is clicked */}
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
