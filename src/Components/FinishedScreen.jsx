import React from "react";

function FinishedScreen({ maxPossiblePoints, points, highScore, dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;

  let emoji = "";
  if (percentage >= 80) {
    emoji = "🥇";
  } else if (percentage >= 60 && percentage < 80) {
    emoji = "🥈";
  } else if (percentage >= 36 && percentage < 60) {
    emoji = "🤔";
  } else {
    emoji = "😭";
  }

  return (
    <>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">HighScore : {highScore} points</p>
      <button
        onClick={() => dispatch({ type: "Restart" })}
        className="btn btn-ui">
        Restart
      </button>
    </>
  );
}

export default FinishedScreen;
