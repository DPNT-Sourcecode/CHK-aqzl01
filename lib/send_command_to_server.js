'use strict';

const TDL = require('tdl-client-nodejs');
const UserInputAction = require('./runner/user_input_action');
const utils = require('./runner/utils');
const EntryPointMapping = require('./entry_point_mapping');

/**
 * ~~~~~~~~~~ Running the system: ~~~~~~~~~~~~~
 *
 *   From IDE:
 *      Run this file from the IDE.
 *
 *   From command line:
 *      npm start
 *
 *   To run your unit tests locally:
 *      npm test
 *
 * ~~~~~~~~~~ The workflow ~~~~~~~~~~~~~
 *
 *   By running this file you interact with a challenge server.
 *   The interaction follows a request-response pattern:
 *        * You are presented with your current progress and a list of actions.
 *        * You trigger one of the actions by typing it on the console.
 *        * After the action feedback is presented, the execution will stop.
 *
 *   +------+-----------------------------------------------------------------------+
 *   | Step | The usual workflow                                                    |
 *   +------+-----------------------------------------------------------------------+
 *   |  1.  | Run this file.                                                        |
 *   |  2.  | Start a challenge by typing "start".                                  |
 *   |  3.  | Read the description from the "challenges" folder.                    |
 *   |  4.  | Locate the file corresponding to your current challenge in:           |
 *   |      |   ./lib/solutions                                                     |
 *   |  5.  | Replace the following placeholder exception with your solution:       |
 *   |      |   throw new Error("method not implemented")                           |
 *   |  6.  | Deploy to production by typing "deploy".                              |
 *   |  7.  | Observe the output, check for failed requests.                        |
 *   |  8.  | If passed, go to step 1.                                              |
 *   +------+-----------------------------------------------------------------------+
 *
 *   You are encouraged to change this project as you please:
 *        * You can use your preferred libraries.
 *        * You can use your own test framework.
 *        * You can change the file structure.
 *        * Anything really, provided that this file stays runnable.
 *
 **/
const args = process.argv.slice(2, process.argv.length);

const entryPointMapping = new EntryPointMapping();

const runner = new TDL.QueryBasedImplementationRunnerBuilder()
    .setConfig(utils.getRunnerConfig())
    .withSolutionFor('sum', entryPointMapping.sum.bind(entryPointMapping))
    .withSolutionFor('hello', entryPointMapping.hello.bind(entryPointMapping))
    .withSolutionFor('fizz_buzz', entryPointMapping.fizz_buzz.bind(entryPointMapping))
    .withSolutionFor('checkout', entryPointMapping.checkout.bind(entryPointMapping))
    .withSolutionFor('rabbit_hole', entryPointMapping.rabbit_hole.bind(entryPointMapping))
    .withSolutionFor('increment', entryPointMapping.increment.bind(entryPointMapping))
    .withSolutionFor('to_uppercase', entryPointMapping.to_uppercase.bind(entryPointMapping))
    .withSolutionFor('letter_to_santa', entryPointMapping.letter_to_santa.bind(entryPointMapping))
    .withSolutionFor('count_lines', entryPointMapping.count_lines.bind(entryPointMapping))
    .withSolutionFor('array_sum', entryPointMapping.array_sum.bind(entryPointMapping))
    .withSolutionFor('int_range', entryPointMapping.int_range.bind(entryPointMapping))
    .withSolutionFor('filter_pass', entryPointMapping.filter_pass.bind(entryPointMapping))
    .withSolutionFor('inventory_add', entryPointMapping.inventory_add.bind(entryPointMapping))
    .withSolutionFor('inventory_size', entryPointMapping.inventory_size.bind(entryPointMapping))
    .withSolutionFor('inventory_get', entryPointMapping.inventory_get.bind(entryPointMapping))
    .withSolutionFor('waves', entryPointMapping.waves.bind(entryPointMapping))
    .create();

TDL.ChallengeSession
    .forRunner(runner)
    .withConfig(utils.getConfig())
    .withActionProvider(new UserInputAction(args))
    .start();
