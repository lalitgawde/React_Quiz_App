// import "./App.css";
import { useEffect, useReducer } from "react";
import Header from "./Components/Header";
import Loader from "./Components/Loader";
import StartScreen from "./Components/StartScreen";
import Question from "./Components/Question";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import FinishedScreen from "./Components/FinishedScreen";
import { useRef } from "react";

const initialState = {
  questions: [],
  status: "isLoading", //loading,error,ready,active,finished
  currentQuestion: 1,
  answer: null,
  highScore: 0,
  points: 0,
  activeTimer: 300,
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
  } else if (action.type === "updateTimer") {
    return {
      ...state,
      activeTimer: state.activeTimer - 1,
      status: state.activeTimer === 0 ? "Finished" : state.status,
    };
  } else {
    return state;
  }
}

function App() {
  const [
    {
      questions,
      status,
      currentQuestion,
      answer,
      points,
      highScore,
      activeTimer,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const timerRef = useRef(null);
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

  useEffect(() => {
    if (status === "active" && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        dispatch({ type: "updateTimer" });
      }, 1000);
    }
    if (status !== "active" && timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    () => clearInterval(timerRef.current);
  }, [status, dispatch]);

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
            <div>
              <div className="timer">{`${activeTimer / 60 > 10 ? "" : "0" + Math.floor(activeTimer / 60)} : ${activeTimer % 60 > 9 ? activeTimer % 60 : "0" + (activeTimer % 60)}`}</div>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                currentQuestion={currentQuestion}
              />
            </div>
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
