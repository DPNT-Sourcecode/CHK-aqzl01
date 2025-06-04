var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('assert');

const one = require('../../../lib/solutions/TST/one');
// noinspection JSUnusedLocalSymbols
const two = require('../../../lib/solutions/TST/two');

describe('TST challenge', function() {
	it('show one', function() {
		assert.equal(one(), 1);
	});
});