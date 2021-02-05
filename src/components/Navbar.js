import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/navbar.css";
import logo from "../stylesheets/logo.png";

// Navbar component
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">
                    EasyShare
                    <img className="logo" src={logo} alt="Logo"></img>
                </Link>
            </div>
            <ul className="nav-ul">
                <li className="nav-li">
                    <Link className="about" to="/about">
                        About
                    </Link>
                </li>
                {/* <li className="nav-li">
                    <Link className="about" to="/help">
                        Help
                    </Link>
                </li> */}
            </ul>
        </nav>
    );
};

export default Navbar;
