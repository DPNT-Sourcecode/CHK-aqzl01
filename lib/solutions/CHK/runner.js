const CheckoutSolution = require("./checkout_solution");

skus = "ABBAC";

const solution = new CheckoutSolution();

const value = solution.checkout(skus);

console.log(new CheckoutSolution().checkout("AAAAAAAAA") === 380);

console.log(value);

