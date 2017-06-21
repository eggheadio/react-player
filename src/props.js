import PropTypes from 'prop-types'

const { string, bool, number, array, oneOfType, shape, object, func } = PropTypes

export const propTypes = {
  url: oneOfType([ string, array ]),
  wistia_url: oneOfType([ string, array ]),
  hls_url: oneOfType([ string, array ]),
  dash_url: oneOfType([ string, array ]),
  poster: string,
  playing: bool,
  loop: bool,
  controls: bool,
  volume: number,
  playbackRate: number,
  width: oneOfType([ string, number ]),
  height: oneOfType([ string, number ]),
  style: object,
  progressFrequency: number,
  playsinline: bool,
  soundcloudConfig: shape({
    clientId: string,
    showArtwork: bool
  }),
  youtubeConfig: shape({
    playerVars: object,
    preload: bool
  }),
  facebookConfig: shape({
    appId: string
  }),
  dailymotionConfig: shape({
    params: object,
    preload: bool
  }),
  vimeoConfig: shape({
    iframeParams: object,
    preload: bool
  }),
  vidmeConfig: shape({
    format: string
  }),
  fileConfig: shape({
    attributes: object,
    forceAudio: bool,
    forceHLS: bool,
    forceDASH: bool
  }),
  onReady: func,
  onStart: func,
  onPlay: func,
  onPause: func,
  onBuffer: func,
  onEnded: func,
  onError: func,
  onDuration: func,
  onProgress: func
}

export const defaultProps = {
  playing: false,
  loop: false,
  controls: false,
  volume: 0.8,
  playbackRate: 1,
  width: 640,
  height: 360,
  hidden: false,
  progressFrequency: 1000,
  playsinline: false,
  soundcloudConfig: {
    clientId: 'e8b6f84fbcad14c301ca1355cae1dea2',
    showArtwork: true
  },
  youtubeConfig: {
    playerVars: {},
    preload: false
  },
  facebookConfig: {
    appId: '1309697205772819'
  },
  dailymotionConfig: {
    params: {},
    preload: false
  },
  vimeoConfig: {
    iframeParams: {},
    preload: false
  },
  vidmeConfig: {
    format: null
  },
  fileConfig: {
    attributes: {},
    forceAudio: false,
    forceHLS: false,
    forceDASH: false
  },
  onReady: function () {},
  onStart: function () {},
  onPlay: function () {},
  onPause: function () {},
  onBuffer: function () {},
  onEnded: function () {},
  onError: function () {},
  onDuration: function () {},
  onProgress: function () {}
}
