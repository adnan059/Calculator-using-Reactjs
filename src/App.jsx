import React, { useReducer } from "react";
import "./App.css";
import DigitBtn from "./components/DigitBtn";
import OperationBtn from "./components/OperationBtn";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

////////////////////////////////////////////////

const evaluate = ({ prevOpr, currOpr, opr }) => {
  const prev = parseFloat(prevOpr);
  const curr = parseFloat(currOpr);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (opr) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;

    case "*":
      computation = prev * curr;
      break;

    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
};
/////////////////////////////////////////////////

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return { ...state, currOpr: payload.digit, overwrite: false };
      }

      if (state.currOpr == null && payload.digit == ".")
        return {
          ...state,
          currOpr: `0${payload.digit}`,
        };

      if (payload.digit === "0" && state.currOpr === "0") return state;

      if (payload.digit === "." && state.currOpr.includes(".")) return state;

      return { ...state, currOpr: `${state.currOpr || ""}${payload.digit}` };

      break;

    case ACTIONS.CLEAR:
      return {
        currOpr: null,
        prevOpr: null,
        opr: null,
      };
      break;

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currOpr == null && state.prevOpr == null) return state;

      if (state.currOpr == null) {
        return { ...state, opr: payload.operation };
      }

      if (state.prevOpr == null) {
        return {
          ...state,
          opr: payload.operation,
          prevOpr: state.currOpr,
          currOpr: null,
        };
      }

      return {
        ...state,
        prevOpr: evaluate(state),
        currOpr: null,
        opr: payload.operation,
      };
      break;

    case ACTIONS.EVALUATE:
      if (state.opr == null || state.currOpr == null || state.prevOpr == null)
        return state;
      return {
        ...state,
        prevOpr: null,
        currOpr: evaluate(state),
        opr: null,
        overwrite: true,
      };
      break;

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return { ...state, currOpr: null, overwrite: false };
      if (state.currOpr == null) return state;
      if (state.currOpr.length === 1) return { ...state, currOpr: null };

      return {
        ...state,
        currOpr: state.currOpr.slice(0, -1),
      };

      break;

    default:
      break;
  }
};

///////////////////////////////////////////

const App = () => {
  const [{ currOpr, prevOpr, opr }, dispatch] = useReducer(reducer, {});

  //////////////////////////////
  return (
    <div className="calculator">
      <div className="output">
        <div className="prevOpr">
          {prevOpr} {opr}
        </div>
        <div className="currOpr">{currOpr}</div>
      </div>
      <button
        className="dblSpace"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationBtn operation="/" dispatch={dispatch}>
        /
      </OperationBtn>
      <DigitBtn digit="1" dispatch={dispatch}>
        1
      </DigitBtn>
      <DigitBtn digit="2" dispatch={dispatch}>
        2
      </DigitBtn>
      <DigitBtn digit="3" dispatch={dispatch}>
        3
      </DigitBtn>
      <OperationBtn operation="*" dispatch={dispatch}>
        *
      </OperationBtn>
      <DigitBtn digit="4" dispatch={dispatch}>
        4
      </DigitBtn>
      <DigitBtn digit="5" dispatch={dispatch}>
        5
      </DigitBtn>
      <DigitBtn digit="6" dispatch={dispatch}>
        6
      </DigitBtn>
      <OperationBtn operation="+" dispatch={dispatch}>
        +
      </OperationBtn>
      <DigitBtn digit="7" dispatch={dispatch}>
        7
      </DigitBtn>
      <DigitBtn digit="8" dispatch={dispatch}>
        8
      </DigitBtn>
      <DigitBtn digit="9" dispatch={dispatch}>
        9
      </DigitBtn>
      <OperationBtn operation="-" dispatch={dispatch}>
        -
      </OperationBtn>
      <DigitBtn dispatch={dispatch} digit=".">
        .
      </DigitBtn>
      <DigitBtn digit="0" dispatch={dispatch}>
        0
      </DigitBtn>
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        className="dblSpace"
      >
        =
      </button>
    </div>
  );
};

export default App;
