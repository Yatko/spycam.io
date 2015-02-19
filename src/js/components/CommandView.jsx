var React = require('react');
var CommandActions = require('../actions/CommandActions');
var CommandStore = require('../stores/CommandStore');
var CommandView = React.createClass({
  getInitialState: function() {
    return {
      command: null,
      url: null,
      mime: null,
      streamUrl: null
    };
  },
  _onRun: function(commandObject) {
    this.setState(commandObject);
  },

  componentDidMount: function() {
    CommandStore.addRunListener(this._onRun);
  },

  componentWillUnmount: function() {
    CommandStore.removeRunListener(this._onRun);
  },

  render: function() {
    switch(this.state.mime) {
      case 'image':
        return (
          <img
            {...this.props}
            className="img-responsive"
            src={this.state.url} />
        );
      case 'iframe':
        return (
          <iframe
            {...this.props}
            src={this.state.url} />
        );
      case 'rtmp':

        var _unsafeHtml = "<embed " +
          "src=\""+ this.state.streamUrl + "\" " +
          "type=\"video/quicktime\" " +
          "width=\"200\" " +
          "height=\"150\" " +
          "autoPlay=\"true\" " +
          "qtsrc=\"" + this.state.streamUrl + "\" "+
          "target=\"myself\" " +
          "scale=\"tofit\" " +
          "controller=\"false\" " +
          "pluginspage=\"http://www.apple.com/quicktime/download/\" " +
          "loop=\"false\"/>";

        return (
          <div dangerouslySetInnerHTML={{__html: _unsafeHtml }} />
        );
      default:
        return <span/>;
    }
  }
})

module.exports = CommandView;
