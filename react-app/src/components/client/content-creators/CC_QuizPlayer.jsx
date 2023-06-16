import React, { useState } from "react";
import CC_QuestionDisp from "./CC_QuestionDisp.jsx";

const CC_QuizPlayer = ({ questions }) => {
  return (
    <>
      {questions.map((q, i) => (
        <CC_QuestionDisp key={i} question={q} />
      ))}
    </>
  );
};

export default CC_QuizPlayer;
