"use strict";

let input = document.getElementById('input'), // input/output button
  number = document.querySelectorAll('.numbers div'), // number buttons
  operator = document.querySelectorAll('.operators div'), // operator buttons
  result = document.getElementById('result'), // equal button
  clear = document.getElementById('clear'), // clear button
  resultDisplayed = false; // flag to keep an eye on what output is displayed

// adding click handlers to number buttons
for (let i = 0; i < number.length; i++) {
  number[i].addEventListener("click", function (e) {

    // storing current input string and its last character in letiables - used later
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    // if result is not diplayed, just keep adding
    if (resultDisplayed === false) {
      input.innerHTML += e.target.innerHTML;
    } else if (resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
      // if result is currently displayed and user pressed an operator
      // we need to keep on adding to the string for next operation
      resultDisplayed = false;
      input.innerHTML += e.target.innerHTML;
    } else {
      // if result is currently displayed and user pressed a number
      // we need clear the input string and add the new input to start the new opration
      resultDisplayed = false;
      input.innerHTML = "";
      input.innerHTML += e.target.innerHTML;
    }

  });
}

// adding click handlers to number buttons
for (let i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", function (e) {

    // storing current input string and its last character in letiables - used later
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    // if last character entered is an operator, replace it with the currently pressed one
    if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
      let newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
      input.innerHTML = newString;
    } else if (currentString.length == 0) {
      // if first key pressed is an opearator, don't do anything
      console.log("enter a number first");
    } else {
      // else just add the operator pressed to the input
      input.innerHTML += e.target.innerHTML;
    }

  });
}

// on click of 'equal' button
result.addEventListener("click", function () {

  // this is the string that we will be processing eg. -10+26+33-56*34/23
  let inputString = input.innerHTML;

  // forming an array of numbers. eg for above string it will be: numbers = ["10", "26", "33", "56", "34", "23"]
  let numbers = inputString.split(/\+|\-|\*|\//g);

  // forming an array of operators. for above string it will be: operators = ["+", "+", "-", "*", "/"]
  // first we replace all the numbers and dot with empty string and then split
  let operators = inputString.replace(/[0-9]|\./g, "").split("");

  console.log(inputString);
  console.log(operators);
  console.log(numbers);
  console.log("----------------------------");

  // now we are looping through the array and doing one operation at a time.
  // first divide, then multiply, then subtraction and then addition
  // as we move we are alterning the original numbers and operators array
  // the final element remaining in the array will be the output

  let divide = operators.indexOf("/");
  while (divide != -1) {
    numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
    operators.splice(divide, 1);
    divide = operators.indexOf("/");
  }

  let multiply = operators.indexOf("*");
  while (multiply != -1) {
    numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
    operators.splice(multiply, 1);
    multiply = operators.indexOf("*");
  }

  let subtract = operators.indexOf("-");
  while (subtract != -1) {
    numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
    operators.splice(subtract, 1);
    subtract = operators.indexOf("-");
  }

  let add = operators.indexOf("+");
  while (add != -1) {
    // using parseFloat is necessary, otherwise it will result in string concatenation :)
    numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
    operators.splice(add, 1);
    add = operators.indexOf("+");
  }

  input.innerHTML = numbers[0]; // displaying the output

  resultDisplayed = true; // turning flag if result is displayed
});

// clearing the input on press of clear
clear.addEventListener("click", function () {
  input.innerHTML = "";
})

/* add support for numeric keyboard */
document.addEventListener("keydown", function (event) {
  let key = event.key;
  if (key >= '0' && key <= '9') {
    // if a numeric key is pressed, add the corresponding number to the input
    input.innerHTML += key;
  } else if (key === '.') {
    // if decimal key is pressed, add it to the input
    input.innerHTML += '.';
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    // if an operator key is pressed, add it to the input
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    // if last character entered is an operator, replace it with the currently pressed one
    if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷") {
      let newString = currentString.substring(0, currentString.length - 1) + key;
      input.innerHTML = newString;
    } else if (currentString.length == 0) {
      // if first key pressed is an operator, don't do anything
      console.log("enter a number first");
    } else {
      // else just add the operator pressed to the input
      input.innerHTML += key;
    }
  } else if (key === 'Enter' || key === '=') {
    // if enter key is pressed, evaluate the expression
    evaluateExpression()
  } else if (key === 'Backspace') {
    // if backspace key is pressed, remove the last character from the input
    input.innerHTML = input.innerHTML.slice(0, -1);
  }
});

// on click of 'equal' button
function evaluateExpression() {
  // this is the string that we will be processing eg. -10+26+33-56*34
  let inputString = input.innerHTML;

  // forming an array of numbers. eg for above string it will be: numbers = ["10", "26", "33", "56", "34"]
  let numbers = inputString.split(/\+|\-|\*|\//g);

  // forming an array of operators. for above string it will be: operators = ["-", "+", "*", "-"]
  // first we replace all the numbers and dot with empty string and then split
  let operators = inputString.replace(/[0-9]|\./g, "").split("");

  // removing empty first and last elements of the array
  // in case of string starting or ending with operator eg. -10+26+33-56*34-
  if (operators[0] === "") {
    operators.shift();
  }
  if (operators[operators.length - 1] === "") {
    operators.pop();
  }

  // now we do multiplication and division first
  // note: we are looping backwards
  for (let i = operators.length - 1; i >= 0; i--) {
    if (operators[i] === "*" || operators[i] === "/") {
      // if operator is multiplication or division, we calculate the result of expression from left to right
      let result;
      if (operators[i] === "*") {
        result = parseFloat(numbers[i]) * parseFloat(numbers[i + 1]);
      } else {
        result = parseFloat(numbers[i]) / parseFloat(numbers[i + 1]);
      }

      // replacing adjacent operands and operator with result
      numbers.splice(i, 2, result.toFixed(2));

      // removing the operator
      operators.splice(i, 1);
    }
  }

  // now we do addition and subtraction
  let result = parseFloat(numbers[0]);
  for (let i = 0; i < operators.length; i++) {
    let number = parseFloat(numbers[i + 1]);
    let operator = operators[i];
    if (operator === "+") {
      result += number;
    } else {
      result -= number;
    }
  }

  // displaying the result
  input.innerHTML = result;
  resultDisplayed = true;
}

