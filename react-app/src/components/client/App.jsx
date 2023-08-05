import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TranscriptForCreators from "./QuizEdit/Transcript.jsx";
import { useNavigate } from "react-router-dom";
import FetchFeatured from "./FetchFeatured.jsx";
import TakeQuiz from "./TakeQuiz.jsx";
import YoutubeTest from "./YoutubeTest.jsx";

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
        <button className="navBTNs" onClick={() => navigate("/qz")}>
          Take Quiz
        </button>
      </div>
      <br></br>
      <Routes>
        <Route path="/" element={<FetchFeatured />} />
        <Route path="/tx" element={<TranscriptForCreators />} />
        <Route path="/qz" element={<TakeQuiz />} />
        <Route path="/yt" element={<YoutubeTest />} />
      </Routes>
    </>
  );
};

export default App;
