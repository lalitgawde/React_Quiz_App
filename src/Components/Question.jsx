import React from "react";

function Question({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div>
      <h4>{question.question}</h4>
      <div className="options">
        {question.options.map((option, index) => {
          return (
            <button
              className={`btn btn-option ${index === answer ? "answer" : ""} ${hasAnswered ? (index === question.correctOption ? "correct" : "wrong") : ""}`}
              disabled={hasAnswered}
              onClick={() => dispatch({ type: "setAnswer", payload: index })}
              key={option}>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Question;
