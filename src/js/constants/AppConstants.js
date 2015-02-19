var keyMirror = require('react/lib/keyMirror');

module.exports = {
  CHANGE_EVENT: 'change',
  RUN_EVENT: 'run',

  ActionTypes: keyMirror({
    LOAD_CAMERAS: null,
    LOAD_DEFAULT_CONFIG: null,
    LOAD_CONFIG: null,
    LOAD_PRESET: null,
    LOAD_PRESETS: null,
    LOAD_SET: null,
    SET_CMD: null,
    SET_CONFIG: null,
    EXECUTE_CMD: null,
    EXECUTE_INTERNAL_CMD: null,
    RUN_INTERNAL_COMMAND: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
