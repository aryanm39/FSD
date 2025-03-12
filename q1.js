let display = document.getElementById("display");

function appendNumber(number) {
  display.value += number;
}

function appendOperator(operator) {
  const lastChar = display.value[display.value.length - 1];
  if (!['+', '-', '*', '/'].includes(lastChar)) {
    display.value += operator;
  }
}

function clearDisplay() {
  display.value = '';
}

function calculate() {
    display.value = eval(display.value);
}

