import React from "react";

const QuestionDisp = ({ question, handleAnswerOptionClick }) => {
  return (
    <div>
      <h2>{question.question}</h2>
      <div>
        {question.answerOptions.map((answerOption) => (
          <button
            key={answerOption.answerText}
            onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
          >
            {answerOption.answerText}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisp;
