import React from "react";
import "../stylesheets/about.css";

// component to act as the About page
const About = () => {
    return (
        <div className="about">
            <h1 className="about-heading">
                About EasyShare.
                <hr className="about-hr" />
            </h1>
            <section className="main-text">
                <div className="about-text">
                    <p className="about-p">
                        This is an application to help share files with ease.
                    </p>

                    <p className="about-p">
                        Just drag and drop any file or choose any file from your
                        system. Once the file is uploaded, you can either
                        download the file from that page or you can also get a
                        link to share the file.
                    </p>
                    <p className="about-p">
                        The supported file formats are:{" "}
                        <span className="file-type">png</span>,{" "}
                        <span className="file-type">jpg</span>,{" "}
                        <span className="file-type">jpeg</span>,{" "}
                        <span className="file-type">webp</span>,{" "}
                        <span className="file-type">svg</span>,{" "}
                        <span className="file-type">gif</span>,{" "}
                        <span className="file-type">doc</span>,{" "}
                        <span className="file-type">docx</span>,{" "}
                        <span className="file-type">pdf</span>,{" "}
                        <span className="file-type">ppt</span>,{" "}
                        <span className="file-type">pptx</span>,{" "}
                        <span className="file-type">xls</span>,{" "}
                        <span className="file-type">xlsx</span>. The shareable
                        link is valid for 15 days, after which you will have to
                        re-upload the required file.
                    </p>
                    <p className="about-p">
                        In case of any issues with the app, contact the
                        developer using the links in the footer or by dropping a
                        mail to{" "}
                        <a
                            href="mailto:rajatm544@gmail.com"
                            target="_blank"
                            rel="noreferrer noopener">
                            <span className="file-type">this email-id</span>
                        </a>
                    </p>
                </div>
                <i className="lni lni-question-circle"></i>
            </section>
        </div>
    );
};

export default About;
