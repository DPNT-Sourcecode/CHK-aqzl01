#!/usr/bin/env node
try {
    var reporter = require('nodeunit').reporters.default;
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    process.exit();
}

var diveSync = require("diveSync"),
    fs = require("fs"),
    directoriesToTest = ['test'];

diveSync(directoriesToTest[0], {directories:true}, function(err, file) {
    if (fs.lstatSync(file).isDirectory()) {
        directoriesToTest.push(file);
    }
});

process.chdir(__dirname);
for (let eachDirIndex in directoriesToTest) {
    reporter.run([directoriesToTest[eachDirIndex]]);
}
