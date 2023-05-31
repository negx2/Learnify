import React from "react";
import QuizPlayer from "./QuizPlayer";
import FetchQuiz from "./FetchQuiz";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transcript from "./Transcript";

//  test commit

const questions = [
  {
    question_text:
      "What is the output of the following code? console.log(2 + '2' + 2);",
    choices: [
      { choice_text: "222", is_correct: true },
      { choice_text: "6", is_correct: false },
      { choice_text: "Error", is_correct: false },
      { choice_text: "undefined", is_correct: false },
    ],
  },
  {
    question_text: "What is the result of the following expression? 5 * '10'",
    choices: [
      { choice_text: "510", is_correct: false },
      { choice_text: "50", is_correct: true },
      { choice_text: "Error", is_correct: false },
      { choice_text: "undefined", is_correct: false },
    ],
  },
  {
    question_text: "What is the result of the following expression? typeof NaN",
    choices: [
      { choice_text: "number", is_correct: true },
      { choice_text: "string", is_correct: false },
      { choice_text: "object", is_correct: false },
      { choice_text: "undefined", is_correct: false },
    ],
  },
];

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
