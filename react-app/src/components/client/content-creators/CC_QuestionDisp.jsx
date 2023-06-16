import React, { useState, useEffect } from "react";
import $ from "jquery";
import ProgressBar from "@ramonak/react-progress-bar";

const CC_QuestionDisp = ({ question }) => {
  const originalQ = Object.assign({}, question);
  const editableQ = Object.assign({}, question);

  const [creatorQ, setCreatorQ] = useState(editableQ);
  const [ansUpdated, setAnsUpdated] = useState(false);
  // const [dis, Dis] = useState(false);

  const updateAnswer = (index) => {
    if (editableQ.choices[index].is_correct) {
      editableQ.choices[index].is_correct = false;
    } else {
      editableQ.choices[index].is_correct = true;
    }
    ansUpdated ? setAnsUpdated(false) : setAnsUpdated(true);
  };

  const updateQuestion = (newText) => {
    editableQ.question_text = newText;
  };

  const updateQnA = (e) => {
    e.preventDefault();
    console.log("Updated Q & A", creatorQ);
    // Hit an API endpoint to overwrite updated QnA
  };

  const discardChanges = (e) => {
    e.preventDefault();
    setCreatorQ(originalQ);
    console.log("assas", originalQ);
    // dis ? Dis(false) : Dis(true);
  };

  useEffect(() => {
    // setCreatorQ(question);
  }, [ansUpdated]);

  return (
    <div className="qna">
      <form action="">
        <br></br>
        <textarea
          rows="5"
          cols="30"
          onChange={(e) => {
            updateQuestion(e.target.value);
          }}
        >
          {question.question_text}
        </textarea>

        <br></br>
        <ul>
          {creatorQ.choices.map((choice, index) => (
            <li key={index}>
              {choice.is_correct ? (
                <span className="corrAns" onClick={() => updateAnswer(index)}>
                  {choice.choice_text}
                </span>
              ) : (
                <span className="wrongAns" onClick={() => updateAnswer(index)}>
                  {choice.choice_text}
                </span>
              )}
            </li>
          ))}
        </ul>
        <br></br>
        <div className="EditBTNs">
          <button className="updateQnABTN" type="submit" onClick={updateQnA}>
            Update
          </button>

          <button className="discardBTN" type="submit" onClick={discardChanges}>
            Discard
          </button>
        </div>
        <br></br>
        <br></br>
      </form>
    </div>
  );
};

export default CC_QuestionDisp;
