import React, { useState } from "react";

const QuestionDisp = ({ question, handleAnswerOptionClick }) => {
  const tempAns = [];
  const [selectedAnswers, setSelectedAnswers] = useState({});
  return (
    <div className="qna">
      <form action="">
        <p>{question.question_text}</p>
        <br></br>
        <div>
          {question.choices.map((choice, index) => (
            <div key={index}>
              <input
                type="checkbox"
                onClick={(e) => {
                  if (e.target.checked) {
                    // add it to selected answers
                    tempAns.push(e.target.value);
                  } else {
                    // pop out
                  }
                  console.log(
                    "input:",
                    e.target.value,
                    e.target.checked,
                    tempAns
                  );
                }}
                id={choice.choice_text}
                value={choice.choice_text}
              />
              <label>{choice.choice_text}</label>
            </div>
          ))}
        </div>
        <br></br>
        <div>
          <button
            className="submitBTN"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              // validate users asnwers
              // console.log("input:", e);
              // handleAnswerOptionClick(answerOption.isCorrect);
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionDisp;
