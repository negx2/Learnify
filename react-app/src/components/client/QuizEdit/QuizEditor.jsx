import React, { useState } from "react";
import QuestionEditor from "./QuestionEditor.jsx";

const QuizEditor = ({ questions }) => {
  const questionUpdateHandler = (updatedQ, qID) => {
    console.log("Q_CHG", updatedQ, qID); // find which question is being updated in order to save it
  };
  const answerUpdateHandler = (updatedAns, contentTruth, qID, choiceID) => {
    console.log("A_CHG", updatedAns, contentTruth, qID, choiceID); // find which question is being updated in order to save it
  };
  return (
    <>
      {questions.map((q, i) => {
        return (
          <QuestionEditor
            key={i}
            question={q}
            questionUpdateHandler={questionUpdateHandler}
            answerUpdateHandler={answerUpdateHandler}
            qID={i}
          />
        );
      })}
    </>
  );
};

export default QuizEditor;
