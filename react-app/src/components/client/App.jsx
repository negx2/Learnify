import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transcript from "./Transcript.jsx";
import { questions } from "../HelperFuncs/sampleQnA.js";
import QuizPlayer from "./QuizPlayer.jsx";
import FetchQuiz from "./FetchQuiz.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizPlayer questions={questions} />} />
        <Route path="/tx" element={<Transcript />} />
        <Route path="/fetch" element={<FetchQuiz />} />
      </Routes>
    </Router>
  );
};

export default App;
