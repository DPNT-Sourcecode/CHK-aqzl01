const CheckoutSolution = require("./checkout_solution");

const solution = new CheckoutSolution();

function createTest(testStr, expectedValue) {
  console.log(`----- TEST -----`)
  console.log(`INPUT: ${testStr}`)
  const answer = solution.checkout(testStr)
  console.log(`OUTPUT: ${answer}`)
  console.log(`EXPECTED: ${expectedValue}`)
  if (answer !== expectedValue) {
    console.error("FAILED TEST")
  } else {
    console.log("PASSED")
  }
}

createTest("A", 50)
createTest("B", 30)
createTest("C", 20)
createTest(".", -1)
createTest("l", -1)

createTest("AAA", 130)
createTest("AAAA", 180)
createTest("AAAAA", 200)
createTest("AAAAAA", 250)
createTest("AAAAAAAA", 330)

createTest("EE", 80)
createTest("EEB", 80)
createTest("EEBB", 110)
createTest("FFF", 20)
createTest("NNNM", 120)
createTest("RRRQQQ", 210)

createTest("UUUU", 120)
createTest("UUUUU", 160)
createTest("UUUUUUUU", 240)
console.log("----- END OF TESTS -----")

