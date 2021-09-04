import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import "./style.global.css";
import { Provider } from "react-redux";
import { store } from "./state";
import { HashRouter as Router } from "react-router-dom";
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);
