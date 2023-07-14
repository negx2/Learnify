import React, { useState, useEffect } from "react";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "@ramonak/react-progress-bar";
import EditableQuestion from "./EditableQuestion.jsx";
import EditableAnswer from "./EditableAnswer.jsx";

const QuestionEditor = ({
  question,
  questionUpdateHandler,
  answerUpdateHandler,
  qID,
  saveChanges,
  restoreQnA,
}) => {
  const [creatorQ, setCreatorQ] = useState(question);
  const [qRemoved, setQremoved] = useState(false);

  const disableQ = (e) => {
    e.preventDefault();
    setQremoved(true);
  };
  const keepQ = (e) => {
    e.preventDefault();
    setQremoved(false);
  };

  return (
    <div className="qna">
      <br></br>

      {qRemoved ? (
        <>
          <div>
            Question removed!{" "}
            <button className="keepBTN" onClick={keepQ}>
              Restore <FontAwesomeIcon icon={faUndo} />
            </button>
          </div>
        </>
      ) : (
        <>
          <EditableQuestion
            q={question.question_text}
            questionUpdateHandler={questionUpdateHandler}
            qID={qID}
          />
          <br></br>
          <ul>
            {creatorQ.choices.map((choice, index) => {
              return (
                <div key={index}>
                  <EditableAnswer
                    ans={choice.choice_text}
                    ansTruth={choice.is_correct}
                    answerUpdateHandler={answerUpdateHandler}
                    qID={qID}
                    choiceID={index}
                  />
                </div>
              );
            })}
          </ul>
          <button className="saveBTN" onClick={() => saveChanges(qID)}>
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button className="restoreBTN" onClick={() => restoreQnA(qID)}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button className="discardBTN" onClick={disableQ}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      )}

      <br></br>
      {/* <hr></hr> */}
      {/* <hr></hr> */}
      <br></br>
      <hr></hr>
      <hr></hr>
    </div>
  );
};

export default QuestionEditor;
