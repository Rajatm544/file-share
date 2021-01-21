import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Download from "./components/Download";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
    return (
        <div>
            <Router>
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route
                        path="/file/download/:id"
                        exact
                        component={Download}
                    />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
