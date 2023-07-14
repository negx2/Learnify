import React, { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import ContentEditable from "react-contenteditable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";

const EditableQuestion = ({ q, questionUpdateHandler, qID }) => {
  const [content, setContent] = useState(q);
  const [editing, setEditing] = useState(false);

  const onContentChange = React.useCallback((evt) => {
    const sanitizeConf = {
      allowedTags: ["b", "i", "a", "p"],
      allowedAttributes: { a: ["href"] },
    };
    // need to send ID of Q along with chnages
    questionUpdateHandler(
      sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf),
      qID
    );
    // is setting content below needed??
    // setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
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
            {/* <button className="restoreBTN" onClick={() => restoreQnA(qID)}>
            <FontAwesomeIcon icon={faUndo} />
          </button> */}

            <span className="restoreBTN" onClick={undoChanges}>
              {/* &#10005; */}
              <FontAwesomeIcon icon={faUndo} />
            </span>
          </>
        ) : null}
      </span>
    </div>
  );
};

export default EditableQuestion;
