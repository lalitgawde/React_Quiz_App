import React from "react";

function Progress({
  currentQuestion,
  numQuestions,
  points,
  totalPointsAvaible,
  answer,
}) {
  return (
    <div className="progress">
      <progress
        max={numQuestions}
        value={currentQuestion - 1 + Number(answer !== null)}
      />
      <p>
        <strong>{currentQuestion}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{points}</strong>/{totalPointsAvaible}
      </p>
    </div>
  );
}

export default Progress;
