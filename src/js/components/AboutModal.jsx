var _ = require('lodash');
var React = require('react/addons');
var Modal = require('react-bootstrap/Modal');
var OverlayMixin = require('react-bootstrap/OverlayMixin');


var AboutWindow = React.createClass({
  mixins: [OverlayMixin],

  getInitialState: function() {
    return {
      isModalOpen: false
    };
  },
  handleToggle: function(e) {
    if (e) e.preventDefault();

    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  render: function() {
    var addon = this.props.children || <i className="fa fa-question-circle"></i>;
    this.props.classNameBtn = this.props.className || "btn btn-sm pull-right";

    return (
      <a {...this.props} className={this.props.classNameBtn} onClick={this.handleToggle} href="">{addon}</a>
    );
  },
  renderOverlay: function() {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    return (
      <Modal {...this.props} className="about-modal" backdrop={true} animation={true} onRequestHide={this.handleToggle} >
        <div className="modal-body text-center">
          <h3 className="title">
            spycam<em>.io</em>
          </h3>
          <h2>
            IP Camera Tool
          </h2>
          <p className="text-muted">
            <small>
              for Foscam<sup>&reg;</sup> IP and Wireless IP cameras
              <span className="brand"><i className="fa fa-h-square"></i> <a href="http://yatko.com" className="text-muted" target="_blank"> yatko.com/spycam.io</a></span>
            </small>
          </p>
        </div>
      </Modal>
    );
  }
});

module.exports = AboutWindow;
