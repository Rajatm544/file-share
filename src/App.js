import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // React Router

// import all the required components
import Home from "./components/Home";
import Download from "./components/Download";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import About from "./components/About";
import "./App.css";

const App = () => {
    return (
        <div className="app">
            <Router>
                <Navbar />
                <Switch>
                    {/* Home page component */}
                    <Route path="/" exact component={Home} />
                    {/* The donwload page needs to have the id of the file to be downloaded in its params */}
                    <Route path="/download/:id" exact component={Download} />
                    {/* The about page */}
                    <Route path="/about" exact component={About} />
                    {/* A catch-all page to display 404-error */}
                    <Route component={NotFound} />
                </Switch>
            </Router>
            <Footer />
        </div>
    );
};

export default App;
