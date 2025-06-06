const CheckoutSolution = require("./checkout_solution");

const standardPricing = new Map([
  ["A", 50],
  ["B", 30],
  ["C", 20],
  ["D", 15],
  ["E", 40],
  ["F", 10],
  ["G", 20],
  ["H", 10],
  ["I", 35],
  ["J", 60],
  ["K", 80],
  ["L", 90],
  ["M", 15],
  ["N", 40],
  ["O", 10],
  ["P", 50],
  ["Q", 30],
  ["R", 50],
  ["S", 30],
  ["T", 20],
  ["U", 40],
  ["V", 50],
  ["W", 20],
  ["X", 90],
  ["Y", 10],
  ["Z", 50],
]);
const skuCatalogue = new Set(standardPricing.keys());

const counts = Object.fromEntries(
  skuCatalogue.values().map((value) => [value, 0])
);
console.log(counts);

