import React from "react";

function NextButton({ dispatch, answer, numQuestions, currentQuestion }) {
  console.log("numQuestions", numQuestions, "currentQuestion", currentQuestion);
  if (answer === null) return null;
  if (currentQuestion === numQuestions) {
    return (
      <button
        onClick={() => dispatch({ type: "Finished" })}
        className="btn btn-ui">
        Finish
      </button>
    );
  }
  if (currentQuestion < numQuestions) {
    return (
      <button
        onClick={() => dispatch({ type: "NextQuestion" })}
        className="btn btn-ui">
        Next
      </button>
    );
  }
}

export default NextButton;
