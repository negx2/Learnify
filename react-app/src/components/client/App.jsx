import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transcript from "./content-creators/Transcript.jsx";
import { useNavigate } from "react-router-dom";
import FetchFeatured from "./FetchFeatured.jsx";

const App = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mainBTNs">
        <button className="navBTNs" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="navBTNs" onClick={() => navigate("/tx")}>
          Content Creators
        </button>
      </div>
      <br></br>
      <Routes>
        <Route path="/" element={<FetchFeatured />} />
        <Route path="/tx" element={<Transcript />} />
      </Routes>
    </>
  );
};

export default App;
