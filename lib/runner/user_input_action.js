'use strict';

var Promise = require('promise');
var Readline = require('readline');

var readFromConsole = function() {
    return new Promise(function (resolve) {
        var consoleIn = Readline.createInterface({
            input: process.stdin
        });
        consoleIn.question('', function(answer) {
            resolve(answer);
            consoleIn.close();
            process.stdin.destroy();
        });
    });
};

function UserInputAction(args) {
    this._args = args;
}

UserInputAction.prototype.get = function() {
    var self = this;

    return self._args.length > 0
        ? Promise.resolve(self._args[0])
        : readFromConsole();
};

module.exports = UserInputAction;
