import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

const EditableAnswer = ({
  ans,
  ansTruth,
  answerUpdateHandler,
  qID,
  choiceID,
}) => {
  const [content, setContent] = useState(ans);
  const [contentTruth, setContentTruth] = useState(ansTruth);
  const [editing, setEditing] = useState(false);

  const onContentChange = React.useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };

    // inorder to lift content up to parent
    // esentially setConent cna be a fn from parent
    // FN below also needs to lift bool val and ID of choice (and its question ID too??)
    answerUpdateHandler(
      sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf),
      contentTruth,
      qID,
      choiceID
    );
    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  const undoChanges = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    setContent(ans);
    setContentTruth(ansTruth);
    setEditing(false);
  };

  const updateAnswer = () => {
    if (contentTruth) {
      setContentTruth(false);
      answerUpdateHandler(content, false, qID, choiceID);
    } else {
      setContentTruth(true);
      answerUpdateHandler(content, true, qID, choiceID);
    }
  };

  return (
    <div className="choicesSection">
      <li
        className={contentTruth ? "corrAns" : "wrongAns"}
        onClick={updateAnswer}
        onFocus={() => setEditing(true)}
      >
        <ContentEditable onChange={onContentChange} html={content} />
      </li>

      {editing ? (
        <div className="EditAnsBTNs">
          <span className="undoBTN" onClick={undoChanges}>
            &#10005;
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default EditableAnswer;
