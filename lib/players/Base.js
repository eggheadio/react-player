'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _props2 = require('../props');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SEEK_ON_PLAY_EXPIRY = 5000;

var Base = function (_Component) {
  _inherits(Base, _Component);

  function Base() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Base);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Base.__proto__ || Object.getPrototypeOf(Base)).call.apply(_ref, [this].concat(args))), _this), _this.isReady = false, _this.startOnPlay = true, _this.durationOnPlay = false, _this.seekOnPlay = null, _this.onPlay = function () {
      var _this$props = _this.props,
          volume = _this$props.volume,
          onStart = _this$props.onStart,
          onPlay = _this$props.onPlay,
          onDuration = _this$props.onDuration,
          playbackRate = _this$props.playbackRate;

      if (_this.startOnPlay) {
        _this.setPlaybackRate(playbackRate);
        _this.setVolume(volume);
        onStart();
        _this.startOnPlay = false;
      }
      onPlay();
      if (_this.seekOnPlay) {
        _this.seekTo(_this.seekOnPlay);
        _this.seekOnPlay = null;
      }
      if (_this.durationOnPlay) {
        onDuration(_this.getDuration());
        _this.durationOnPlay = false;
      }
    }, _this.onReady = function () {
      var _this$props2 = _this.props,
          onReady = _this$props2.onReady,
          playing = _this$props2.playing,
          onDuration = _this$props2.onDuration;

      _this.isReady = true;
      _this.loadingSDK = false;

      onReady();
      if (playing || _this.preloading) {
        _this.preloading = false;
        if (_this.loadOnReady) {
          _this.load(_this.loadOnReady);
          _this.loadOnReady = null;
        } else {
          _this.play();
        }
      }
      var duration = _this.getDuration();
      if (duration) {
        onDuration(duration);
      } else {
        _this.durationOnPlay = true;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Base, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var url = this.props.url;

      this.mounted = true;
      if (url) {
        this.load(url);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stop();
      this.mounted = false;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props = this.props,
          playing = _props.playing,
          volume = _props.volume,
          playbackRate = _props.playbackRate;

      var url = this.props.dash_url || this.props.hls_url || this.props.wistia_url || this.props.url;
      var nextUrl = nextProps.dash_url || nextProps.hls_url || nextProps.wistia_url;
      // Invoke player methods based on incoming props
      if (url !== nextUrl && nextUrl) {
        this.seekOnPlay = null;
        this.startOnPlay = true;
        this.load(nextProps);
      }

      if (url && !nextUrl) {
        this.stop();
        clearTimeout(this.updateTimeout);
      }

      if (!playing && nextProps.playing) {
        this.play();
      }

      if (playing && !nextProps.playing) {
        this.pause();
      }

      if (volume !== nextProps.volume) {
        this.setVolume(nextProps.volume);
      }

      if (playbackRate !== nextProps.playbackRate) {
        this.setPlaybackRate(nextProps.playbackRate);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var url = this.props.dash_url || this.props.hls_url || this.props.wistia_url;
      var nextUrl = nextProps.dash_url || nextProps.hls_url || nextProps.wistia_url;
      return url !== nextUrl;
    }
  }, {
    key: 'seekTo',
    value: function seekTo(fraction) {
      var _this2 = this;

      // When seeking before player is ready, store value and seek later
      if (!this.isReady && fraction !== 0) {
        this.seekOnPlay = fraction;
        setTimeout(function () {
          _this2.seekOnPlay = null;
        }, SEEK_ON_PLAY_EXPIRY);
      }
    }
  }]);

  return Base;
}(_react.Component);

Base.propTypes = _props2.propTypes;
Base.defaultProps = _props2.defaultProps;
exports['default'] = Base;
module.exports = exports['default'];