import React from "react";
import "../stylesheets/navbar.css";
import logo from "../stylesheets/logo.png";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand" onClick={() => window.location.reload()}>
                EasyShare
                <img className="logo" src={logo} alt="Logo"></img>
            </div>
            <ul className="nav-ul">
                <li className="nav-li">About</li>
                <li className="nav-li">Help</li>
            </ul>
        </nav>
    );
};

export default Navbar;
