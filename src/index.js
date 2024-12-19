import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@arco-design/web-react/dist/css/arco.css";
import App from "./App";
import { UserProvider } from "./contexts/user.context";
import { OpeningsProvider } from "./contexts/categories.context";
import { EndgameProvider } from "./contexts/endgame.context";

import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <OpeningsProvider>
          <EndgameProvider>
            <App />
          </EndgameProvider>
        </OpeningsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
