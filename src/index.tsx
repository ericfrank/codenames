import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { initColorScheme } from "./util/colorScheme";

initColorScheme();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
