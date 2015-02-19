var React = require('react');
var Command = require('./Command.jsx');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');

var CommandsList = React.createClass({
  getDefaultProps: function() {
    return {
      type: 'list'
    };
  },

  render: function() {

    if (this.props.type === 'row') {
      return (
        <Row {...this.props}>
          <Col sm={12}>
            {this.props.commands.map((command, i) =>
                <Command {...command} run={this.props.run} key={i}/>
            )}
          </Col>
        </Row>
      );
    }

    if (this.props.type === 'list') {
      return (
        <ul {...this.props} className="list-unstyled">
          {this.props.commands.map( (command, i) =>
            <li><Command {...command} run={this.props.run} key={i}/></li>
          )}
        </ul>
      );
    }
  }
});

module.exports = CommandsList;
