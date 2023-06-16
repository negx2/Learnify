import React, { useState } from "react";
import QuestionDispEdit from "./QuestionDispEdit.jsx";

const QuizPlayerEdit = ({ questions }) => {
  return (
    <>
      {questions.map((q, i) => (
        <QuestionDispEdit key={i} question={q} />
      ))}
    </>
  );
};

export default QuizPlayerEdit;
