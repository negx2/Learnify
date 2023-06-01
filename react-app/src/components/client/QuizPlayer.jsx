import React, { useState } from "react";
import QuestionDisp from "./QuestionDisp.jsx";

const QuizPlayer = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  const renderResults = () => {
    return (
      <div>
        <p>
          You scored {score} out of {questions.length} questions.
        </p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  };

  const renderQuiz = () => {
    return (
      <QuestionDisp
        question={questions[currentQuestion]}
        handleAnswerOptionClick={handleAnswerOptionClick}
      />
    );
  };

  return <div>{showResults ? renderResults() : renderQuiz()}</div>;
};

export default QuizPlayer;
