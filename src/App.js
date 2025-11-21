import React from "react";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/navigation/navigation.bar";
import Home from "./routes/home/home";
import Gallery from "./routes/gallery/gallery";
import Endgame from "./routes/endgame/endgame";
import ChessBoard from "./routes/Board/board";
import StrategyBoard from "./routes/Board/strategyBoard.jsx";
import Authentication from "./routes/authentication/authentication.component.jsx";

import "./App.css";
import Bio from "./routes/Bio/Bio.jsx";

const App = () => {
  return (
    <div>
      <Navigation />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="endgame" element={<Endgame />} />
          <Route path="board" element={<ChessBoard />} />
          <Route path="/strategy" element={<StrategyBoard />} />
          <Route path="auth" element={<Authentication />} />
          <Route path="/:name" element={<Bio />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
