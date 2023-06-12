import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transcript from "./Transcript.jsx";
import { useNavigate } from "react-router-dom";
import FetchFeatured from "./FetchFeatured.jsx";

const App = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <button className="navBTNs" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="navBTNs" onClick={() => navigate("/tx")}>
          Quiz from Transcript
        </button>
      </div>
      <Routes>
        <Route path="/" element={<FetchFeatured />} />
        <Route path="/tx" element={<Transcript />} />
      </Routes>
    </>
  );
};

export default App;
