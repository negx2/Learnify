import React, { useState, useEffect } from "react";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "@ramonak/react-progress-bar";
import EditableQuestion from "./EditableQuestion.jsx";
import EditableAnswer from "./EditableAnswer.jsx";

const QuestionEditor = ({
  question,
  qID,
  updateQuestion,
  updateChoices,
  restoreQnA,
}) => {
  // const [creatorQ, setCreatorQ] = useState(question);
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
            updateQuestion={updateQuestion}
            qID={qID}
          />
          <br></br>
          <ul>
            {question.choices.map((choice, index) => {
              // console.log("rerendering??", choice);
              return (
                <div key={index}>
                  <EditableAnswer
                    ans={choice.choice_text}
                    ansTruth={choice.is_correct}
                    updateChoices={updateChoices}
                    qID={qID}
                    choiceID={index}
                  />
                </div>
              );
            })}
          </ul>
          <button className="saveBTN" onClick={() => keepQ()}>
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button className="restoreBTN" onClick={restoreQnA}>
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
