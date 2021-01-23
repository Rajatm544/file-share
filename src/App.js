import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Download from "./components/Download";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import "./App.css";

const App = () => {
    return (
        <div className="app">
            <Navbar />
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route
                        path="/file/download/:id"
                        exact
                        component={Download}
                    />
                    <Route component={NotFound} />
                </Switch>
            </Router>
            <Footer />
        </div>
    );
};

export default App;
