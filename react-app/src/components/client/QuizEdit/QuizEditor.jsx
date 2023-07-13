import React, { useState } from "react";
import QuestionEditor from "./QuestionEditor.jsx";

const QuizEditor = ({ questions }) => {
  return (
    <>
      {questions.map((q, i) => {
        return <QuestionEditor key={i} question={q} />;
      })}
    </>
  );
};

export default QuizEditor;
