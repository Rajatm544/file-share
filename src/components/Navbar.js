import React from "react";
import "../stylesheets/navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <span className="nav-brand">EasyShare</span>
            <ul className="nav-ul">
                <li className="nav-li">About</li>
                <li className="nav-li">Help</li>
            </ul>
        </nav>
    );
};

export default Navbar;
