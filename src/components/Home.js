import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import download from "downloadjs";

const Home = (props) => {
    const [file, setFile] = useState({});
    const [state, setState] = useState({
        title: "",
        description: "",
    });
    const [allFiles, setAllFiles] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/file")
            .then((allFiles) => setAllFiles([...allFiles.data]))
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const { title, description } = state;

            if (title.trim() && description.trim()) {
                const formdata = new FormData();
                formdata.append("title", title.trim());
                formdata.append("description", description.trim());
                formdata.append("file", file);

                axios
                    .post("http://localhost:5000/file/", formdata, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((data) => console.log(data))
                    .catch((err) => console.error(err));
            }
        } catch (error) {
            if (error) console.error(error.message);
        }
    };

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        console.log(allFiles);
    }, [allFiles]);

    const downloadLink = (id, path, mimetype) => {
        const folders = path.split("/");
        let filename = folders.pop();
        const lastUnderScore = filename.lastIndexOf("_");
        filename = filename.slice(lastUnderScore + 1);
        axios
            .get(`http://localhost:5000/file/download/${id}`, {
                responseType: "blob",
            })
            .then((file) => {
                return download(file.data, filename, mimetype);
            })
            .catch((err) => console.error(err));
    };
    return (
        <center>
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={state.title}
                    type="text"
                    onChange={handleChange}
                    placeholder="Title for the file"
                />
                <br />
                <input
                    name="description"
                    value={state.description}
                    type="text"
                    onChange={handleChange}
                    placeholder="Description for the file"
                />
                <br />
                <input
                    type="file"
                    onChange={handleFile}
                    formEncType="multipart/form-data"
                />
                <br />
                <button type="submit">Submit</button>
            </form>
            <br />
            <br />
            {allFiles.map((file, index) => {
                const { _id, file_path, file_mimetype } = file;
                return (
                    <div key={index}>
                        <a
                            href="#/"
                            onClick={() =>
                                downloadLink(_id, file_path, file_mimetype)
                            }>
                            Download File no {index}
                        </a>{" "}
                        <Link to={`/file/download/${_id}`}>Shareable Link</Link>
                        <br />
                        <br />
                    </div>
                );
            })}
        </center>
    );
};

export default Home;
