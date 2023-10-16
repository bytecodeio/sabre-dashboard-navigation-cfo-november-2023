import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import "./style.css";

window.addEventListener("DOMContentLoaded", (event) => {
  var root = document.createElement("div");
  root.id = "react-app-container";
  document.body.appendChild(root);
  ReactDOM.render(<App />, root);
});
