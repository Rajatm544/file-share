import React from "react";
import { Link } from "react-router-dom";
import error404 from "../stylesheets/error-404.svg";
import "../stylesheets/notFound.css";

const NotFound = () => {
    return (
        <div className="error-page">
            <img className="err-404" src={error404} alt="404" />
            <p className="not-found">Page Not Found.</p>
            <p className="not-found">
                Looks Like You've Landed on The Wrong Page!
            </p>
            <p className="not-found">
                Click
                <Link className="link-home" to="/">
                    {" "}
                    Here{" "}
                </Link>
                to Go to The Home Page.
            </p>
        </div>
    );
};

export default NotFound;
