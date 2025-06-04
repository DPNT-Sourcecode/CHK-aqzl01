var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('assert');
const SumSolution = require('../../../lib/solutions/SUM/sum_solution');

describe('SUM challenge: adding two numbers', function() {
	it('should return 3, which is the sum of 1 and 2', function() {
	    assert.equal(new SumSolution().compute(1, 2), 3);
	});
});