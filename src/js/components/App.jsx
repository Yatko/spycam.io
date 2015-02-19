var _ = require('lodash');
var React = require('react');
var CommandStore = require('../stores/CommandStore');
var CommandsActions = require('../actions/CommandActions');

// Components
var CommandView = require('./CommandView.jsx');
var CommandsList = require('./CommandsList.jsx');
var AboutModal = require('./AboutModal.jsx');
var SettingsModal = require('./SettingsModal.jsx');

var Accordion = require('react-bootstrap/Accordion');
var Col = require('react-bootstrap/Col');
var Grid = require('react-bootstrap/Grid');
var Input = require('react-bootstrap/Input');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var Panel = require('react-bootstrap/Panel');
var Row = require('react-bootstrap/Row');
var Well = require('react-bootstrap/Well');
var Button = require('react-bootstrap/Button');

var App = React.createClass({
  getInitialState: function() {
    return { commands: CommandStore.getCommandsList() };
  },

  getCommandByGroup: function (group) {
    return _.where(this.state.commands,  { group });
  },

  _onChange: function() {
    this.setState(CommandStore.buildData());
  },

  componentDidMount: function() {
    // Loading default config
    CommandsActions.loadDefaultConfig();
    CommandStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CommandStore.removeChangeListener(this._onChange);
  },

  handleSetCmd: function(cmd, value, instant, mime) {
    CommandsActions.setCmd(cmd, value, mime);

    if (instant) {
      CommandsActions.executeCmd();
    }
  },

  handleExecuteCmd: function(e) {
    CommandsActions.executeCmd();
  },

  handleUpdateCmd: function() {
    CommandsActions.setCmd(this.refs.command.getDOMNode().value, this.refs.value.getDOMNode().value);
  },
  render: function() {
    return (
      <Grid>
        <Well>
          <h3 className="title">
            spycam<em>.io</em> IP Camera Tool
            <SettingsModal className="btn btn-sm btn-link pull-right">IP Camera Setup</SettingsModal>
          </h3>
          <Row>
            <Col sm={5}>
              <Accordion>
                <Panel header="Control Panel">
                  <SettingsModal />
                  <Col sm={5}>
                    <CommandsList commands={this.getCommandByGroup('column-1')} run={this.handleSetCmd} type="row" />
                  </Col>
                  <Col sm={7}>
                    <CommandsList commands={this.getCommandByGroup('column-2')} run={this.handleSetCmd} type="row" />
                  </Col>
                  <CommandsList commands={this.getCommandByGroup('brightness')} run={this.handleSetCmd} type="row" />
                  <br/>
                  <CommandsList commands={this.getCommandByGroup('additional-row')} run={this.handleSetCmd} type="row" className="row-small" />
                </Panel>
                <Panel header="PTZ Commands" eventKey={2}>
                  <CommandsList commands={this.getCommandByGroup('ptz-commands')} run={this.handleSetCmd} type="list" />
                </Panel>
                <Panel header="Image Commands" eventKey={3}>
                  <CommandsList commands={this.getCommandByGroup('image')} run={this.handleSetCmd} type="list" />
                </Panel>
                <Panel header="Video Commands" eventKey={4}>
                  <CommandsList commands={this.getCommandByGroup('commands-video')} run={this.handleSetCmd} type="list" />
                </Panel>
                {/* ToDo <Panel header="Commands Other" eventKey={5}>
                  <CommandsList commands={this.getCommandByGroup('commands-other')} run={this.handleSetCmd} type="list" />
                </Panel>*/}
              </Accordion>
              <Row>
                <Col sm={12}>
                  <div className="form-inline">
                      <Row>
                        <div className="form-group col-xs-12 col-sm-6 col-md-5">
                          <input ref="command" value={this.state.command} onChange={this.handleUpdateCmd} type="text" className="form-control input-sm cmd-string" placeholder="sc:\> type in CGI Command" />
                        </div>
                        <div className="form-group  col-xs-12 col-sm-3 col-md-4">
                          <input ref="value" value={this.state.value} onChange={this.handleUpdateCmd} type="text" className="form-control input-sm cmd-value" placeholder="Parameter (value)" />
                        </div>
                        <div className="form-group  col-xs-12 col-sm-3 col-md-3">
                          <button type="button" className="btn btn-success btn-sm"  onClick={this.handleExecuteCmd}>Send Cmd</button>
                        </div>
                      </Row>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm={7}>
              <Row>
                <Col sm={12}>
                  <div className="embed-responsive embed-responsive-4by3">
                    <CommandView className="embed-responsive-item" command={this.state.commandToRun} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <div className="form-group">
                    <div className="show-url xpull-right">{this.state.mime === 'iframe' ? this.state.url : ''}</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <small className="text-muted">IP Camera Tool by spycam.io - CGI API, ONVIF, ISAPI, SPYAPI, IR led/filter control, PTZ, Color, Image -settings and more.<br />Foscam, Hikvision, Tenvis, Dahua, Huacam, Lorex, TRENDnet. <AboutModal /></small>
        </Well>
      </Grid>
    );
  }

});

module.exports = App;
