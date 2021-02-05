import React from "react";
import "../stylesheets/footer.css";

// component to display footer
const Footer = () => {
    return (
        <footer>
            <div className="name">
                <span style={{ fontWeight: "500" }}>Built By</span> Rajat
            </div>
            <div className="icons">
                <a
                    href="https://dev.to/rajatm544"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Link to Dev.to Profile"
                    title="Dev.to">
                    <i className="lni lni-dev"></i>
                </a>
                <a
                    href="https://github.com/Rajatm544"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Link to Github Profile"
                    title="Github">
                    <i className="lni lni-github-original"></i>
                </a>
                <a
                    href="https://www.linkedin.com/in/rajat--m/"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Link to Linkedin Profile"
                    title="LinkedIn">
                    <i className="lni lni-linkedin-original"></i>
                </a>
                <a
                    href="https://medium.com/@rajat_m"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Link to Medium Profile"
                    title="Medium">
                    <i className="lni lni-medium"></i>
                </a>
                <a
                    href="https://twitter.com/Rajat__m"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Link to Twitter Profile"
                    title="Twitter">
                    <i className="lni lni-twitter-original"></i>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
