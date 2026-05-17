const display = document.getElementById("display");
const history = document.getElementById("history");
const keypad = document.querySelector(".keypad");
const angleToggle = document.getElementById("angleToggle");

let expression = "";
let lastAnswer = "0";
let angleMode = "DEG";

const functions = new Set(["sin", "cos", "tan", "sqrt", "log", "ln", "abs", "exp"]);
const operators = {
  "+": { precedence: 1, assoc: "L", args: 2 },
  "-": { precedence: 1, assoc: "L", args: 2 },
  "*": { precedence: 2, assoc: "L", args: 2 },
  "/": { precedence: 2, assoc: "L", args: 2 },
  "%": { precedence: 2, assoc: "L", args: 2 },
  "^": { precedence: 3, assoc: "R", args: 2 },
  "u-": { precedence: 4, assoc: "R", args: 1 },
  "!": { precedence: 5, assoc: "L", args: 1 }
};

function updateScreen() {
  display.textContent = expression || "0";
}

function appendValue(value) {
  expression += value;
  updateScreen();
}

function clearAll() {
  expression = "";
  history.textContent = "Ready";
  updateScreen();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateScreen();
}

function appendFactorial() {
  if (!expression) {
    return;
  }
  expression += "!";
  updateScreen();
}

function insertAnswer() {
  expression += lastAnswer;
  updateScreen();
}

function negateCurrent() {
  if (!expression) {
    expression = "-";
    updateScreen();
    return;
  }

  expression = `(-1)*(${expression})`;
  updateScreen();
}

function factorial(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Factorial only works for non-negative integers");
  }

  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

function applyFunction(name, value) {
  const angleValue = angleMode === "DEG" ? (value * Math.PI) / 180 : value;

  if (name === "sin") return Math.sin(angleValue);
  if (name === "cos") return Math.cos(angleValue);
  if (name === "tan") return Math.tan(angleValue);
  if (name === "sqrt") return Math.sqrt(value);
  if (name === "log") return Math.log10(value);
  if (name === "ln") return Math.log(value);
  if (name === "abs") return Math.abs(value);
  if (name === "exp") return Math.exp(value);

  throw new Error("Unsupported function");
}

function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char === " ") {
      i += 1;
      continue;
    }

    if (/\d|\./.test(char)) {
      let num = char;
      i += 1;
      while (i < input.length && /[\d.]/.test(input[i])) {
        num += input[i];
        i += 1;
      }
      tokens.push({ type: "number", value: Number(num) });
      continue;
    }

    if (/[a-z]/i.test(char)) {
      let word = char;
      i += 1;
      while (i < input.length && /[a-z]/i.test(input[i])) {
        word += input[i];
        i += 1;
      }

      if (word === "pi") {
        tokens.push({ type: "number", value: Math.PI });
      } else if (word === "e") {
        tokens.push({ type: "number", value: Math.E });
      } else if (functions.has(word)) {
        tokens.push({ type: "function", value: word });
      } else {
        throw new Error(`Unknown token: ${word}`);
      }
      continue;
    }

    if ("+-*/%^()!".includes(char)) {
      tokens.push({ type: "symbol", value: char });
      i += 1;
      continue;
    }

    throw new Error(`Invalid character: ${char}`);
  }

  return tokens;
}

function toRpn(tokens) {
  const output = [];
  const stack = [];
  let previous = null;

  tokens.forEach((token) => {
    if (token.type === "number") {
      output.push(token);
      previous = token;
      return;
    }

    if (token.type === "function") {
      stack.push(token);
      previous = token;
      return;
    }

    const symbol = token.value;

    if (symbol === "(") {
      stack.push(token);
      previous = token;
      return;
    }

    if (symbol === ")") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }

      if (!stack.length) {
        throw new Error("Mismatched parentheses");
      }

      stack.pop();

      if (stack.length && stack[stack.length - 1].type === "function") {
        output.push(stack.pop());
      }

      previous = token;
      return;
    }

    let operator = symbol;
    if (
      symbol === "-" &&
      (!previous || (previous.type === "symbol" && previous.value !== ")" && previous.value !== "!") || previous.type === "function")
    ) {
      operator = "u-";
    }

    while (stack.length) {
      const top = stack[stack.length - 1];
      const topValue = top.value;

      if (top.type === "function") {
        output.push(stack.pop());
        continue;
      }

      if (topValue === "(" || !operators[topValue]) {
        break;
      }

      const currentOp = operators[operator];
      const stackOp = operators[topValue];
      const shouldPop =
        (currentOp.assoc === "L" && currentOp.precedence <= stackOp.precedence) ||
        (currentOp.assoc === "R" && currentOp.precedence < stackOp.precedence);

      if (!shouldPop) {
        break;
      }

      output.push(stack.pop());
    }

    stack.push({ type: "operator", value: operator });
    previous = { type: "operator", value: operator };
  });

  while (stack.length) {
    const top = stack.pop();
    if (top.value === "(" || top.value === ")") {
      throw new Error("Mismatched parentheses");
    }
    output.push(top);
  }

  return output;
}

function evalRpn(rpn) {
  const stack = [];

  rpn.forEach((token) => {
    if (token.type === "number") {
      stack.push(token.value);
      return;
    }

    if (token.type === "function") {
      const value = stack.pop();
      stack.push(applyFunction(token.value, value));
      return;
    }

    const op = token.value;

    if (op === "u-") {
      stack.push(-stack.pop());
      return;
    }

    if (op === "!") {
      stack.push(factorial(stack.pop()));
      return;
    }

    const right = stack.pop();
    const left = stack.pop();

    if (left === undefined || right === undefined) {
      throw new Error("Invalid expression");
    }

    if (op === "+") stack.push(left + right);
    else if (op === "-") stack.push(left - right);
    else if (op === "*") stack.push(left * right);
    else if (op === "/") stack.push(left / right);
    else if (op === "%") stack.push(left % right);
    else if (op === "^") stack.push(left ** right);
  });

  if (stack.length !== 1 || Number.isNaN(stack[0])) {
    throw new Error("Invalid calculation");
  }

  return stack[0];
}

function evaluateExpression() {
  if (!expression) {
    return;
  }

  try {
    const tokens = tokenize(expression);
    const rpn = toRpn(tokens);
    const result = evalRpn(rpn);

    if (!Number.isFinite(result)) {
      throw new Error("Result is not finite");
    }

    history.textContent = expression;
    lastAnswer = Number.parseFloat(result.toFixed(12)).toString();
    expression = lastAnswer;
    updateScreen();
  } catch (error) {
    history.textContent = error.message;
    display.textContent = "Error";
    expression = "";
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest(".key");
  if (!button) {
    return;
  }

  const { value, action } = button.dataset;

  if (value) {
    appendValue(value);
    return;
  }

  if (action === "clear") clearAll();
  else if (action === "backspace") backspace();
  else if (action === "equals") evaluateExpression();
  else if (action === "factorial") appendFactorial();
  else if (action === "ans") insertAnswer();
  else if (action === "negate") negateCurrent();
});

angleToggle.addEventListener("click", () => {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  angleToggle.textContent = angleMode;
  angleToggle.setAttribute("aria-pressed", String(angleMode === "RAD"));
});

document.addEventListener("keydown", (event) => {
  if (/\d/.test(event.key) || "+-*/().%^".includes(event.key)) {
    appendValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    evaluateExpression();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key === "Delete" || event.key.toLowerCase() === "c") {
    clearAll();
  } else if (event.key === "!") {
    appendFactorial();
  }
});

updateScreen();
