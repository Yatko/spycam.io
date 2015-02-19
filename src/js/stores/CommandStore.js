var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/AppConstants');
var Reqwest = require('reqwest');
var assign = require('object-assign');
var waterfall = require('async-waterfall');
var ini = require('ini');
var _ = require('lodash');

// camera storage
var _cameras = [];
// data storage
var _data = [];
// Default config
var _defaultConfig = {};
// Config
var _config = {};
// Commands list
var _commands = require('./commands.json');
// Store current command
var _command;
// Store curren value
var _value;
// Presets
var _presets = {};
// Mime
var _mime;

function loadSet(name, cb) {
  waterfall([
    function (cb) {
      var promise = Reqwest({
        url: name + '.ini'
      });

      promise.then(function(data) {
        data = data.response || data;
        cb(null, ini.parse(data))
      });
      promise.fail(cb);
    },
    function (config, cb) {
      var promise = Reqwest({
        url: name + '_commands.ini'
      });

      promise.then(function(data) {
        data = data.response || data;

        cb(null, assign(config, ini.parse(data))); });
      promise.fail(cb);
    },
  ], function(err, result) {
    if (err) {
      console.warn('Couldn\'t get config set');
      return;
    }

    cb(result);
  });
}

function loadDefaultConfig() {
  loadSet('config/default', function(result) {
    _defaultConfig = result;
    CommandStore.emitChange();
  });
}

function loadConfig(url) {
  var promise = Reqwest({
    url
  });

  promise.then(function(data) {
    data = data.response || data;

    var config = ini.parse(data);
    CommandStore.setConfig(config);
    CommandStore.emitChange();
  });
}

function loadPreset(name) {
  loadConfig(_presets[name].file);
}

function loadCameras() {
  var promise = Reqwest({
    url: 'config/cams.json',
    type: 'json'
  });

  promise.then(function(data) {
    data = data.response || data;
    _cameras = data;
    CommandStore.emitChange();
  });
}

function loadPresets() {
  var promise = Reqwest({
    url: 'config/presets.ini'
  });

  promise.then(function(data) {
    data = data.response || data;
    _presets = ini.parse(data);
    CommandStore.emitChange();
  });
}

var CommandStore = assign(EventEmitter.prototype, {

  // public methods used by Controller-View to operate on data
  getAll: function() {
    return {
      tasks: _data
    };
  },

  setConfig: function(data) {
    _config = data;
  },

  getConfig: function() {
    return assign(_defaultConfig, _config);
  },

  getCommandsList: function () {
    return _commands;
  },

  getCameras: function () {
    return _cameras;
  },

  getPresets: function () {
    return _presets;
  },

  buildData: function() {
    var config = this.getConfig();
    var command = config[_command] || _command;
    var value = _value || '';
    var url = config.protocol + "://"  + config.host + ":" + config.port + "/" + config.interface + config.action + command + value + "&usr=" + config.user + "&pwd=" + config.pass;
    // ToDO: streamUrl must be more configurable
    var streamUrl = ""
    if (config.stream) {
      streamUrl = config.stream.protocol + "://";

//      if (config.user && config.pass) {
//        streamUrl+= config.user + ":" + config.pass + "@";
//      }

      streamUrl+= config.host + ":" + config.stream.port + config.stream.path;
    }

    if (!command || !config.host) {
      return {
        command: '',
        value: '',
        mime: _mime,
        streamUrl: '',
        url: ''
      };
    }

    return {
      command: _command,
      value: _value,
      mime: _mime,
      streamUrl: streamUrl,
      url: url
    };
  },

  // Allow Controller-View to register itself with store
  addChangeListener: function(callback) {
    this.on(Constants.CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(Constants.CHANGE_EVENT, callback);
  },
  addRunListener: function(callback) {
    this.on(Constants.RUN_EVENT, callback);
  },
  removeRunListener: function(callback) {
    this.removeListener(Constants.RUN_EVENT, callback);
  },

  // triggers change listener above, firing controller-view callback
  emitChange: function() {
    this.emit(Constants.CHANGE_EVENT);
  },
  emitRun: function(obj) {
    this.emit(Constants.RUN_EVENT, obj);
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
      case Constants.ActionTypes.LOAD_DEFAULT_CONFIG:
        loadDefaultConfig();
        break;
      case Constants.ActionTypes.LOAD_CONFIG:
        loadConfig(action.filename);
        break;
      case Constants.ActionTypes.SET_CONFIG:
        CommandStore.setConfig(action.config);
        CommandStore.emitChange();
        break;
      case Constants.ActionTypes.LOAD_CAMERAS:
        loadCameras();
        break;
      case Constants.ActionTypes.LOAD_PRESETS:
        loadPresets();
        break;
      case Constants.ActionTypes.LOAD_PRESET:
        loadPreset(action.name);
        break;
      case Constants.ActionTypes.LOAD_SET:
        loadSet(action.name, function(config) {
          CommandStore.setConfig(config);
          CommandStore.emitChange();
        });
        break;
      case Constants.ActionTypes.EXECUTE_CMD:
        var obj = CommandStore.buildData();

        CommandStore.emitRun(obj);
        break;
      case Constants.ActionTypes.SET_CMD:
        // NOTE: if this action needs to wait on another store:
        //Store.waitFor([OtherStore.dispatchToken]);
        // For details, see: http://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html#why-we-need-a-dispatcher

        _command = '';
        _value = '';

        if (!_.isEmpty(action.command)) {
          _command = action.command;
        }

        if (!_.isEmpty(action.value)) {
          _value = action.value.trim();
        }

        if (!_.isEmpty(action.mime)) {
          _mime = action.mime.trim();
        }

        CommandStore.emitChange();
        break;
    }
  })

});

module.exports = CommandStore;
