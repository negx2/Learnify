import React, { useState, useEffect } from "react";
import QuestionEditor from "./QuestionEditor.jsx";

const QuizEditor = ({
  questions,
  updateQuestion,
  updateChoices,
  restoreQnA,
}) => {
  return (
    <>
      {questions.map((q, i) => {
        return (
          <QuestionEditor
            key={i}
            question={q}
            qID={i}
            updateQuestion={updateQuestion}
            updateChoices={updateChoices}
            restoreQnA={restoreQnA}
          />
        );
      })}
    </>
  );
};

export default QuizEditor;
