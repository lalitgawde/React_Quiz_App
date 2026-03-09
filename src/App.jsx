// import "./App.css";
import { useEffect, useReducer } from "react";
import Header from "./Components/Header";
import Loader from "./Components/Loader";
import StartScreen from "./Components/StartScreen";
import Question from "./Components/Question";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import FinishedScreen from "./Components/FinishedScreen";

const initialState = {
  questions: [],
  status: "isLoading", //loading,error,ready,active,finished
  currentQuestion: 1,
  answer: null,
  highScore: 0,
  points: 0,
};

function reducer(state, action) {
  if (action.type === "dataReceived") {
    return { ...state, questions: action.payload, status: "ready" };
  } else if (action.type === "dataFailed") {
    return { ...state, status: "error" };
  } else if (action.type === "start") {
    return { ...state, status: "active" };
  } else if (action.type === "setAnswer") {
    const question = state.questions[state.currentQuestion - 1];
    return {
      ...state,
      answer: action.payload,
      points:
        question.correctOption === action.payload
          ? state.points + question.points
          : state.points,
    };
  } else if (action.type === "NextQuestion") {
    return {
      ...state,
      answer: null,
      currentQuestion: state.currentQuestion + 1,
    };
  } else if (action.type === "Finished") {
    return {
      ...state,
      status: "Finished",
      highScore:
        state.points > state.highScore ? state.points : state.highScore,
    };
  } else if (action.type === "Restart") {
    return {
      ...initialState,
      status: "ready",
      questions: state.questions,
    };
  } else {
    return state;
  }
}

function App() {
  const [
    { questions, status, currentQuestion, answer, points, highScore },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const totalPointsAvaible = questions.reduce(
    (prev, question) => prev + question.points,
    0,
  );

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((err) => {
        console.log("err", err);
        dispatch({ type: "dataFailed" });
      });
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="main">
        {status === "isLoading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              currentQuestion={currentQuestion}
              points={points}
              totalPointsAvaible={totalPointsAvaible}
              answer={answer}
            />
            <Question
              question={questions[currentQuestion - 1]}
              answer={answer}
              dispatch={dispatch}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              currentQuestion={currentQuestion}
            />
          </>
        )}
        {status === "Finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={totalPointsAvaible}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </main>
    </div>
  );
}

export default App;
