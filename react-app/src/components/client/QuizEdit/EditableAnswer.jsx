import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

const EditableAnswer = ({ ans, ansTruth }) => {
  const [content, setContent] = useState(ans);
  const [contentTruth, setContentTruth] = useState(ansTruth);
  const [editing, setEditing] = useState(false);

  const onContentChange = React.useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };

    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  const undoChanges = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    setContent(ans);
    setContentTruth(ansTruth);
    setEditing(false);
  };
  const saveChanges = (e) => {
    e.preventDefault();
  };
  const updateAnswer = () => {
    if (contentTruth) {
      setContentTruth(false);
    } else {
      setContentTruth(true);
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
          <span className="saveBTN" onClick={saveChanges}>
            &#10003;
          </span>

          <span className="undoBTN" onClick={undoChanges}>
            &#10005;
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default EditableAnswer;
