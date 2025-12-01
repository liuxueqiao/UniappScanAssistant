import { Decimal } from 'decimal.js';

function safeNum(val) {
  return val === null || val === undefined || val === '' ? 0 : val;
}

export const and = (num1, num2, accuracy = 2) =>
  +new Decimal(safeNum(num1)).add(safeNum(num2)).toFixed(accuracy);
export const sub = (num1, num2, accuracy = 2) =>
  +new Decimal(safeNum(num1)).sub(safeNum(num2)).toFixed(accuracy);
export const mul = (num1, num2, accuracy = 2) =>
  +new Decimal(safeNum(num1)).mul(safeNum(num2)).toFixed(accuracy);
export const div = (num1, num2, accuracy = 2) =>
  +new Decimal(safeNum(num1)).div(safeNum(num2)).toFixed(accuracy);
