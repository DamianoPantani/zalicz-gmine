import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { initializeLocales } from "./i18next";

initializeLocales();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);
