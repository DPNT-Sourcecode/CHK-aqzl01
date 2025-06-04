'use strict';

var TDL = require('tdl-client-nodejs');
var ConfigFile = require('./credentials_config_file');
var path = require('path');

module.exports.getConfig = function() {
    return TDL.ChallengeSessionConfig
        .forJourneyId(ConfigFile.readFromConfigFile('tdl_journey_id'))
        .withServerHostname(ConfigFile.readFromConfigFile('tdl_hostname'))
        .withColours(ConfigFile.isTrue(ConfigFile.readFromConfigFileWithDefault('tdl_use_coloured_output', 'true')))
        .withRecordingSystemShouldBeOn(ConfigFile.isTrue(ConfigFile.readFromConfigFileWithDefault('tdl_require_rec', 'true')))
        .withWorkingDirectory(path.resolve(__dirname, '..','..'));
};

module.exports.getRunnerConfig = function() {
    return new TDL.ImplementationRunnerConfig()
        .setRequestQueueName(ConfigFile.readFromConfigFile('tdl_request_queue_name'))
        .setResponseQueueName(ConfigFile.readFromConfigFile('tdl_response_queue_name'))
        .setHostname(ConfigFile.readFromConfigFile('tdl_hostname'));
};
