import React, { useState, useEffect, useRef } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";

const EditableAnswer = ({ ans, ansTruth, updateChoices, qID, choiceID }) => {
  // let content = useRef(ans);

  // const [content, setContent] = useState(ans);

  const [contentTruth, setContentTruth] = useState(ansTruth);
  const [editing, setEditing] = useState(false);

  const onContentChange = React.useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };
    // setContent();
    updateChoices(
      qID,
      choiceID,
      sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf),
      ansTruth
    );
    // setNewContent(newcont);
  }, []);

  const undoChanges = (e) => {
    // e.stopPropagation();
    // e.preventDefault();
    // setContent(ans);
    // setContentTruth(ansTruth);
    // setEditing(false);
  };

  const updateAnswer = () => {
    if (contentTruth) {
      // ansTruth = false;
      // setContent(x);
      setContentTruth(false);
      // answerUpdateHandler(content, true, qID, choiceID);
    } else {
      // content = content.current;
      // setContent(x);
      // ansTruth = true;
      // setContent(content);
      setContentTruth(true);
      // answerUpdateHandler(content, false, qID, choiceID);
    }
    // content = content.current;
  };

  // console.log("ANS", ans);
  // console.log("cont", content.current);
  return (
    <div className="choicesSection">
      <li
        className={contentTruth ? "corrAns" : "wrongAns"}
        // onClick={updateAnswer}
        // onFocus={() => setEditing(true)}
        // onBlur={() => setEditing(false)}
      >
        <ContentEditable onChange={onContentChange} html={ans} />
      </li>

      {editing ? (
        <div className="EditAnsBTNs">
          <span className="restoreBTN" onClick={undoChanges}>
            <FontAwesomeIcon icon={faUndo} />
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default EditableAnswer;
