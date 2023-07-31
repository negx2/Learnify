import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";

const EditableQuestion = ({ q, updateQuestion, qID }) => {
  const [content, setContent] = useState(q);
  const [editing, setEditing] = useState(false);

  const onContentChange = React.useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };
    updateQuestion(
      qID,
      sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf)
    );
  }, []);

  const undoChanges = (e) => {
    e.preventDefault();
    setContent(q);
    setEditing(false);
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
            <span className="restoreBTN" onClick={undoChanges}>
              <FontAwesomeIcon icon={faUndo} />
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
};

export default EditableQuestion;
