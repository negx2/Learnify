import React, { useState } from "react";
import QuestionEditor from "./QuestionEditor.jsx";

const QuizEditor = ({ questions }) => {
  const questionUpdateHandler = (updatedQ, qID) => {
    console.log("Q_CHG", updatedQ, qID); // find which question is being updated in order to save it
  };
  const answerUpdateHandler = (updatedAns, contentTruth, qID, choiceID) => {
    console.log("A_CHG", updatedAns, contentTruth, qID, choiceID); // find which question is being updated in order to save it
  };

  const saveChanges = (qID) => {
    // once q and/or a is eidted and values are updated with the 2 fns above
    // hit an api to save chnages in source
    // consider how discard chnages btn can be handled (it must retrieve unchnaged/former values)
    console.log("need to edit this q n its content ...", questions[qID]);
    // i will need a state var to update chnages coming from 2 fns above
  };

  const restoreQnA = (qID) => {
    // does undo go back 1 step (to prev saved result OR do we want to go back to default)

    // undo with back arrow,
    // restore to original.... restore is most default.
    console.log("reset content to original qna");
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
            saveChanges={saveChanges}
            restoreQnA={restoreQnA}
          />
        );
      })}
    </>
  );
};

export default QuizEditor;
