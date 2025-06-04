var mocha = require("mocha");
var describe = mocha.describe;
var it = mocha.it;
var assert = require("assert");
const CheckoutSolution = require("../../../lib/solutions/CHK/checkout_solution");

describe("CHK challenge: adding two numbers", function () {
  it("should return 0 for no checkout skus", function () {
    assert.equal(new CheckoutSolution().checkout(""), 0);
  });

  it("should return 380 for no checkout skus", function () {
    assert.equal(new CheckoutSolution().checkout("AAAAAAAAA"), 380);
  });
});
