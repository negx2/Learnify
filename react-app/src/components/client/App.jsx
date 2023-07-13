import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transcript from "./Transcript.jsx";
import { questions } from "../HelperFuncs/sampleQnA.js";
import QuizPlayer from "./QuizPlayer.jsx";
import FetchQuiz from "./FetchQuiz.jsx";
import { useNavigate } from "react-router-dom";
import FetchFeatured from "./FetchFeatured.jsx";
import YoutubeTest from "./YoutubeTest.jsx";

const App = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <button className="navBTNs" onClick={() => navigate("/")}>
          Quiz from Sample
        </button>
        <button className="navBTNs" onClick={() => navigate("/tx")}>
          Quiz from Transcript
        </button>
        <button className="navBTNs" onClick={() => navigate("/fetch")}>
          Quiz from Category
        </button>
      </div>

      <br></br>
      <br></br>
      <Routes>
        <Route path="/" element={<QuizPlayer questions={questions} />} />
        <Route path="/tx" element={<Transcript />} />
        <Route path="/fetch" element={<FetchQuiz />} />
        <Route path="/featured" element={<FetchFeatured />} />
        <Route path="/yt" element={<YoutubeTest />} />
      </Routes>
    </>
  );
};

export default App;
