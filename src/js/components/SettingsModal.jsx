var _ = require('lodash');
var React = require('react/addons');
var LensedStateMixin = require('react-lensed-state');
var Modal = require('react-bootstrap/Modal');
var OverlayMixin = require('react-bootstrap/OverlayMixin');
var Input = require('react-bootstrap/Input');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var TransitionGroup = React.addons.CSSTransitionGroup;

var CommandStore = require('../stores/CommandStore');
var CommandsActions = require('../actions/CommandActions');

var SettingsWindow = React.createClass({
  mixins: [LensedStateMixin, OverlayMixin],

  getInitialState: function() {
    return {
      isModalOpen: false,
      showCustom: false,
      config: CommandStore.getConfig(),
      cameras: CommandStore.getCameras(),
      modelsByBrand: [],
      presets: {}
    };
  },
  _onChange: function() {
    this.setState({
      config: CommandStore.getConfig(),
      cameras: CommandStore.getCameras(),
      presets: CommandStore.getPresets()
    });
  },

  componentDidMount: function() {
    // Loading default config
    CommandsActions.loadCameraList();
    CommandsActions.loadPresets();

    CommandStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CommandStore.removeChangeListener(this._onChange);
  },
  handleChangeCustom: function(e) {
    CommandsActions.loadConfig(e.target.value);
  },
  handlePresetChange: function(e) {
    switch (e.target.value) {
      case 'custom':
        this.setState({
          showCustom: true
        });
        break;
      default:
        this.setState({
          showCustom: false
        });
        CommandsActions.loadPreset(e.target.value);
    }
  },
  handleBrandChange: function(e) {
    var searchResult =  _.findWhere(this.state.cameras, { brand: e.target.value });

    this.setState({
      selectedConfig: false,
      modelsByBrand: searchResult ? searchResult.models : []
    });
  },
  handleCameraChange: function(e) {
    this.setState({
      selectedConfig: e.target.value
    });

    CommandsActions.loadSet(e.target.value);
  },
  handleToggle: function(e) {
    if (e) e.preventDefault();

    if (this.state.isModalOpen) {
      CommandsActions.setConfig(this.state.config);
    }

    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  render: function() {
    var addon = this.props.children || <i className="fa fa-cog"></i>;
    this.props.classNameBtn = this.props.className || "btn btn-xs  btn-link pull-right header-button";

    return (
      <a {...this.props} className={this.props.classNameBtn} onClick={this.handleToggle} href="">{addon} <sup>+ Webcam</sup></a>
    );
  },
  renderOverlay: function() {
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    var customHostsList = "";
    if (this.state.presets && this.state.presets.custom && this.state.presets.custom.hosts) {
      customHostsList = (
        this.state.presets.custom.hosts.map((item, i) =>
          <option value={item.split('|')[1]} key={i}>{item.split('|')[0]}</option>
        )
      )
    }

    var customAccessList = "";
    if (this.state.presets && this.state.presets.custom && this.state.presets.custom.access) {
      customAccessList = (
        this.state.presets.custom.access.map((item, i) =>
            <option value={item.split('|')[1]} key={i}>{item.split('|')[0]}</option>
        )
      )
    }


    var customBlock = (
      <Row key={1}>
        <Col sm={12}>
          <div className="form-inline">
            <label>Custom Preset List <i className="fa fa-caret-right"></i></label>

            <Input type="select" className="no-border-input" onChange={this.handleChangeCustom}>
              <option>Select camera preset</option>
              { customHostsList }
            </Input>

            <Input type="select" className="no-border-input" onChange={this.handleChangeCustom}>
              <option>Select user (access)</option>
              { customAccessList }
            </Input>
          </div>
        </Col>
      </Row>
    );

    return (
      <Modal {...this.props} backdrop={true} title="Settings" animation={true} onRequestHide={this.handleToggle} >
        <div className="modal-body">
          <Row>
            <Col sm={6}>
              <Input bsSize="small" valueLink={this.linkState('config.host')} type="text" addonBefore="http://" placeholder="IP or host e.g. 10.0.1.2" />
            </Col>
            <Col sm={3}>
              <Input bSize="small" valueLink={this.linkState('config.port')} type="text" addonAfter={<a href="#">Auto</a>} placeholder="port e.g. 88" />
            </Col>
            <Col sm={3}>
              <Input bSize="small" valueLink={this.linkState('config.stream.port')} type="text" addonAfter={<a href="#">Auto</a>} placeholder="stream port e.g. 80" />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Input bsSize="small" valueLink={this.linkState('config.user')} type="text" addonBefore="Username" placeholder="e.g. admin" />
            </Col>
            <Col sm={6}>
              <Input bsSize="small" valueLink={this.linkState('config.pass')} type="text" addonBefore="Password" placeholder="e.g. admin" />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Input bsSize="small" valueLink={this.linkState('config.interface')} type="text" addonBefore="Interface" placeholder="e.g. /cgi-bin/...?cmd=" />
            </Col>
            <Col sm={6}>
              <Input bsSize="small" valueLink={this.linkState('config.action')} type="text" addonBefore="commandset" placeholder="e.g. foscam" />
            </Col>
          </Row>
          <Row>
          	<Col sm={4}>
          		<div className="btn-group">
	          		<button type="button" className="btn btn-success btn-sm">Save for later</button>
	          		<button type="button" className="btn btn-default btn-sm">Presets</button>
          		</div>
          	</Col>
          	<Col sm={8} className="descr-sm">
          		<p><small className="text-sm">Advanced features like saving of presets or settings require database connection. <a href="#">Click here to create your private space.</a> <sup>info</sup></small></p>
          	</Col>
          </Row>
          <Row className="hidden">{/* TODO reveal onClick */}
          	<Col sm={4} className="text-left descr-xs">
          			<small className="text-xs">Authenticate using your favorite provider or just use your email.</small>
          	</Col>
          	<Col sm={8}>
          		<div className="btn-toolbar">
          			
	          		<button type="button" className="btn btn-facebook btn-sm"><i className="fa fa-facebook"></i></button>
	          		<button type="button" className="btn btn-google btn-sm"><i className="fa fa-google-plus"></i></button>
	          		<button type="button" className="btn btn-twitter btn-sm"><i className="fa fa-twitter"></i></button>
	          		
	          		<button type="button" className="btn btn-linkedin btn-sm"><i className="fa fa-linkedin"></i></button>
	          		<button type="button" className="btn btn-github btn-sm"><i className="fa fa-github"></i></button>
	          		<button type="button" className="btn btn-email btn-sm"><i className="fa fa-envelope-o"></i></button>
	          		
	          		<button type="button" className="btn btn-vk btn-sm"><i className="fa fa-vk"></i></button>
	          		<button type="button" className="btn btn-microsoft btn-sm"><i className="fa fa-windows"></i></button>
	          		<button type="button" className="btn btn-yahoo btn-sm"><i className="fa fa-yahoo"></i></button>
{/*		          		
          			<button type="button" className="btn btn-bitbucket btn-sm"><i className="fa fa-bitbucket"></i></button>
	          		<button type="button" className="btn btn-instagram btn-sm"><i className="fa fa-instagram"></i></button>
	          		<button type="button" className="btn btn-weibo btn-sm"><i className="fa fa-weibo"></i></button>
	          		
	          		<button type="button" className="btn btn-openid btn-sm"><i className="fa fa-openid"></i></button>
*/}
          		</div>
          	</Col>
          </Row>
        </div>
        <div className="modal-footer">
          <Row>
            <Col sm={12}>
              <Input wrapperClassName="form-inline">
                {
                  Object.keys(this.state.presets).map(prop =>
                    <label className="radio-inline">
                      <input type="radio" name="presetRadio" value={prop} onChange={this.handlePresetChange} key={prop} /> {this.state.presets[prop].label}
                    </label>
                  )
                }
              </Input>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div className="form-inline">
                <Input type="select" onChange={this.handleBrandChange} label={<span>Camera Brand <i className="fa fa-caret-right"></i>&nbsp;</span> }>
                  <option>Select Brand</option>
                  {this.state.cameras.map((item, i) =>
                    <option key={i} value={item.brand}>{item.brand}</option>
                  )}
                </Input>
                &nbsp;
                <Input type="select" value={this.state.selectedConfig} onChange={this.handleCameraChange} label={<span>Camera Model <i className="fa fa-caret-right"></i>&nbsp;</span> }>
                  <option>Select Model</option>
                  {this.state.modelsByBrand.map( (item, i) =>
                      <option key={i} value={item.config}>{item.name}</option>
                  )}
                </Input>
              </div>
            </Col>
          </Row>
          <TransitionGroup transitionName="slide">
          {this.state.showCustom ? customBlock :''}
          </TransitionGroup>

          <div className="pull-right">
            <a href="#"><i className="fa fa-h-square"></i> <small>Help</small></a>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = SettingsWindow;
