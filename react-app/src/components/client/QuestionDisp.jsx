import React from "react";

const QuestionDisp = ({ question, handleAnswerOptionClick }) => {
  return (
    <div>
      <h2>{question.question}</h2>
      {/* <h2>{question.question_text}</h2> FORMER */}
      <div>
        {/* {question.choices.map((choice) => ( FORMER */}
        {question.answerOptions.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerOptionClick(choice.is_correct)}
          >
            {choice.choice_text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisp;
