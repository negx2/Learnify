import React, { useState, useEffect } from "react";
import $ from "jquery";
import ProgressBar from "@ramonak/react-progress-bar";

const QuestionDisp = ({
  question,
  handleAnswerOptionClick,
  qNumber,
  totalQuestions,
}) => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [answerIsCorr, setAnswerIsCorr] = useState("yes");

  const validateAnswers = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    a.sort();
    b.sort();
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const nextQuestionBTNhandler = (e) => {
    e.preventDefault();
    const correctAns = [];
    for (let answerChoice of question.choices) {
      if (answerChoice.is_correct) correctAns.push(answerChoice.choice_text);
    }

    if (validateAnswers(correctAns, userAnswers)) {
      handleAnswerOptionClick(true);
      setAnswerIsCorr("yes");
      setUserAnswers([]);
      $("input[type=checkbox]").prop("checked", false);
    } else {
      setAnswerIsCorr("no");
      $(".shake").toggleClass("shake2");
    }
  };

  const userAnswSelectionHandler = (e) => {
    if (e.target.checked) {
      if (!userAnswers.includes(e.target.value))
        setUserAnswers([...userAnswers, e.target.value]);
    } else {
      let userAnswersModified = [...userAnswers];
      let answerIndex = userAnswersModified.indexOf(e.target.value);
      if (answerIndex > -1) {
        userAnswersModified.splice(answerIndex, 1);
        setUserAnswers(userAnswersModified);
      }
    }
  };

  return (
    <div className="qna">
      <form action="">
        {/* <p>
          Questions: {qNumber + 1}/{totalQuestions}
        </p> */}
        <div>
          <ProgressBar
            completed={Math.round((qNumber / totalQuestions) * 100)}
            bgColor={"rgb(53, 204, 53)"}
            height="10px"
            labelSize="10px"
            width="50%"
          />
        </div>
        <br></br>
        <p>{question.question_text}</p>
        <br></br>
        <div>
          {question.choices.map((choice, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={choice.choice_text}
                value={choice.choice_text}
                onClick={userAnswSelectionHandler}
              />
              <label htmlFor={choice.choice_text}>{choice.choice_text}</label>
            </div>
          ))}
        </div>
        <br></br>
        <div className="BTNdiv shake">
          {answerIsCorr === "yes" ? (
            <button
              className="submitBTN"
              type="submit"
              onClick={nextQuestionBTNhandler}
            >
              Attempt
            </button>
          ) : (
            <button
              className="submitBTN"
              type="submit"
              onClick={nextQuestionBTNhandler}
            >
              Try Again!
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionDisp;
