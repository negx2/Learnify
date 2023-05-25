import React from "react";

const QuestionDisp = ({ question, handleAnswerOptionClick }) => {
  console.log("QuestionDisp: question: ");
  console.log(question);
  return (
    <div>
      <h2>{question.question_text}</h2>
      <div>
        {question.choices.map((choice) => (
          <button
            key={choice.choice_text}
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
