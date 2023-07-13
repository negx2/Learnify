import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";

const EditableQuestion = ({ q }) => {
  const [content, setContent] = useState(q);
  const [editing, setEditing] = useState(false);

  const onContentChange = React.useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };

    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  const undoChanges = (e) => {
    e.preventDefault();
    setContent(q);
    setEditing(false);
  };
  const saveChanges = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <span className="questionSection">
        <ContentEditable
          onChange={onContentChange}
          onFocus={() => setEditing(true)}
          html={content}
        />

        {editing ? (
          <>
            <span className="saveBTN" onClick={saveChanges}>
              &#10003;
            </span>

            <span className="undoBTN" onClick={undoChanges}>
              &#10005;
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
};

export default EditableQuestion;
