import React, { useState } from "react";

const QuestionDisp = ({ question, handleAnswerOptionClick }) => {
  let tempAns = [];
  let ansIsCorr;
  const [selectedAnswers, setSelectedAnswers] = useState({});

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  return (
    <div className="qna">
      <form action="">
        <p>{question.question_text}</p>
        <br></br>
        <div>
          {question.choices.map((choice, index) => (
            <div key={index}>
              <input
                type="checkbox"
                onClick={(e) => {
                  if (e.target.checked) {
                    // add it to selected answers only if not in there already
                    if (!tempAns.includes(e.target.value))
                      // console.log("in arr", tempAns);
                      tempAns.push(e.target.value);
                  } else {
                    // pop out
                    let ansIndex = tempAns.indexOf(e.target.value);
                    if (ansIndex > -1) tempAns.splice(ansIndex, 1);
                  }
                  console.log(
                    "input:",
                    e.target.value,
                    e.target.checked,
                    tempAns
                  );
                }}
                id={choice.choice_text}
                value={choice.choice_text}
              />
              <label>{choice.choice_text}</label>
            </div>
          ))}
        </div>
        <br></br>
        <div>
          <button
            className="submitBTN"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              // validate users asnwers
              // console.log("onSub:", question.choices);
              // console.log("input:", e.target.value, e.target.checked, tempAns);

              // if is-corr is true, add text to arr
              // compare arr to tempArr ... sorted, and length must be equal
              let correctAns = [];
              for (let ansChoice of question.choices) {
                if (ansChoice.is_correct) {
                  correctAns.push(ansChoice.choice_text);
                }
              }

              correctAns.sort(); // CONFIRM how sort works for nums as well
              tempAns.sort();

              console.log("onSub:", correctAns, tempAns);
              if (arraysEqual(correctAns, tempAns)) {
                handleAnswerOptionClick(true);
                ansIsCorr = true;
              } else {
                ansIsCorr = false;
              }
            }}
          >
            Submit
          </button>
        </div>
      </form>
      {ansIsCorr === false ? <div>Try again</div> : null}
    </div>
  );
};

export default QuestionDisp;
