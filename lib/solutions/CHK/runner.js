const CheckoutSolution = require("./checkout_solution");

skus = "ABBAC";

const solution = new CheckoutSolution();

const value = solution.checkout(skus);

console.log(new CheckoutSolution().checkout("EEEB"));
console.log(new CheckoutSolution().checkout("EEEB") === 120);
console.log(new CheckoutSolution().checkout("EEB"));
console.log(new CheckoutSolution().checkout("EEB") === 80);
console.log(new CheckoutSolution().checkout("EE"));
console.log(new CheckoutSolution().checkout("EE") === 80);

