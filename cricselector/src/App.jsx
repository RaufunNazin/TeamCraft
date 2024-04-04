import React from "react";
import { GlobalStateProvider } from "./GlobalStateProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MyTeam from "./pages/MyTeam";
import Sidebar from "./components/Sidebar";
import PlayerList from "./pages/PlayerList";

const App = () => {
  return (
    <div className="App font-body" id="outer-container">
      <div id="page-wrap">
        <GlobalStateProvider>
          <BrowserRouter>
            <Sidebar id="sidebar" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/myteam" element={<MyTeam />} />
              <Route path="/playerlist" element={<PlayerList />} />
            </Routes>
          </BrowserRouter>
        </GlobalStateProvider>
      </div>
    </div>
  );
};

export default App;
