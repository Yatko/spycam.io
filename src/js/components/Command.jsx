var React = require('react');
var CommandActions = require('../actions/CommandActions');
var Input = require('react-bootstrap/Input');
var OverlayTrigger = require('react-bootstrap/OverlayTrigger');
var Tooltip = require('react-bootstrap/Tooltip');

var Command = React.createClass({
  propsTypes: {
    cmd: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    icon: React.PropTypes.string,
    type: React.PropTypes.oneOf(['a', 'number', 'range']),
    sup:  React.PropTypes.string,
    value:  React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    run: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return { value: this.props.value };
  },

  getDefaultProps: function() {
    return {
      cmd: '',
      title: '',
      instant: false,
      icon: '',
      sup: '',
      type: 'a',
      min: null,
      max: null,
      mime: 'iframe',
      step: 1
    };
  },

  getIconProp: function (icon) {
    var className = 'fa';

    if (icon) {
      className+= ' ' + icon;
    }

    return className;
  },

  handleRunCmd(e) {
    if (e && !e.target.tagName.match(/^(input)$/i)) {
      e.preventDefault();
    }

    var value = null;

    if (e.target.value) {
      value = e.target.value
    }

    if (this.refs.input) {
      value = this.refs.input.getValue();
    }

    this.setState({ value });
    this.props.run(this.props.cmd, value, this.props.instant, this.props.mime);
  },

  render: function() {
    var command = this.props;
    var addon;

    if (command.sup) {
      addon = <sup>{command.sup}</sup>;
    }

    if (command.type == 'a') {
      return (
        <OverlayTrigger placement="top" overlay={<Tooltip>{this.props.tooltip}</Tooltip>}>
          <a href="" className="btn btn-link" onClick={this.handleRunCmd}>
            <i className={this.getIconProp(this.props.icon)}/>
            {this.props.label}
            {this.props.children}
            {addon}
          </a>
        </OverlayTrigger>
      );
    }

    if (command.type == 'range') {
      return (
        <div className="form-horizontal">
          <Input label={this.props.label} labelClassName="col-xs-4" wrapperClassName="col-xs-8">
            <OverlayTrigger placement="top" overlay={<Tooltip>{this.props.tooltip}: {this.state.value}</Tooltip>}>
              <Input
                ref="input"
                type={command.type}
                defaultValue={this.props.value}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                onChange={this.handleRunCmd}
              />
            </OverlayTrigger>
          </Input>
        </div>
      );
    }

    if (command.type == 'boolean') {
      var isChecked = parseInt(this.state.value) === 1;

      return (
        <div>
          <div className="form-inline">
            <Input label={this.props.label}>

              <Input
                label="On"
                type="radio"
                defaultValue={1}
                checked={isChecked}
                onChange={this.handleRunCmd}
              />
              &nbsp;
              <Input
                label="Off"
                type="radio"
                defaultValue={0}
                checked={!isChecked}
                onChange={this.handleRunCmd}
              />
            </Input>
          </div>
        </div>
      );
    }

    return (
      <input
        ref="input"
        type={command.type}
        defaultValue={this.props.value}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        onChange={this.handleRunCmd}
      />
    )
  }
});

module.exports = Command;
