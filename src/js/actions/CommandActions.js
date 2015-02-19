var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  loadPresets: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOAD_PRESETS
    });
  },

  loadPreset: function(name) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOAD_PRESET,
      name: name
    });
  },

  loadSet: function(name) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOAD_SET,
      name: name
    });
  },

  loadCameraList: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOAD_CAMERAS
    });
  },

  loadDefaultConfig: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOAD_DEFAULT_CONFIG
    });
  },

  loadConfig: function(filename) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.LOAD_CONFIG,
      filename: filename
    });
  },

  setConfig: function(config) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.SET_CONFIG,
      config: config
    });
  },

  setCmd: function(command, value, mime) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.SET_CMD,
      command,
      value,
      mime
    });
  },

  executeCmd: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.EXECUTE_CMD
    });
  }
};
