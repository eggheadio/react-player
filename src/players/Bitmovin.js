import React from 'react'
import loadScript from 'load-script'
import {isFunction} from 'lodash'

import Base from './Base'

const SDK_URL = '//bitmovin-a.akamaihd.net/bitmovin-player/stable/7/bitmovinplayer.js'
const SDK_GLOBAL = 'bitmovin'
const MATCH_URL = /^(https?:\/\/d2c5owlt6rorc3.cloudfront.net\/)(.[^_]*)_(.[^/]*)\/(.*)$/

export default class Bitmovin extends Base {
  static displayName = 'Bitmovin'

  static canPlay(url) {
    return MATCH_URL.test(url)
  }

  getConfig(props) {
    const {dash_url, hls_url, poster} = props || this.props
    return {
      key: "56231f1a-2845-4d2e-a432-07436d3f4958",
      source: {
        dash: dash_url,
        hls: hls_url
      },
      poster: poster,
      skin: {screenLogoImage: ""}
    };
  }

  componentDidMount() {
    const {onPause, onEnded, onPlayerProgress} = this.props
    const url = this.props.dash_url || this.props.hls_url || this.props.wistia_url
    const id = this.getID(url)
    const className = `bitmovin-player-${id}`

    this.loadingSDK = true
    this.getSDK().then((script) => {
      this.loadingSDK = false
      this.player = window.bitmovin.player(className);
      this.player.setup(this.getConfig()).then((value) => {
        this.player.setPosterImage(this.props.poster)
        this.addEventListeners()
        this.onReady()
      }, (reason) => {
        console.error("Error while creating bitdash player instance", reason);
        return reason
      });
    })
  }

  getSDK() {
    return new Promise((resolve, reject) => {
      if (window[SDK_GLOBAL]) {
        resolve()
      } else {
        loadScript(SDK_URL, {async: false}, (err, script) => {
          if (err) reject(err)
          resolve(script)
        })
      }
    })
  }

  getID(url) {
    return url && url.match(MATCH_URL)[2]
  }

  addEventListeners() {
    const {onPause, onEnded, onPlayerProgress} = this.props
    this.player.addEventHandler(this.player.EVENT.ON_PLAY, this.onPlay)
    this.player.addEventHandler(this.player.EVENT.ON_PAUSE, onPause)
    this.player.addEventHandler(this.player.EVENT.ON_PLAYBACK_FINISHED, onEnded)
    this.player.addEventHandler(this.player.EVENT.ON_TIME_CHANGED, onPlayerProgress)
  }

  removeListeners() {
    const {onPause, onEnded, onPlayerProgress} = this.props
    this.player.removeEventHandler(this.player.EVENT.ON_PLAY, this.onPlay)
    this.player.removeEventHandler(this.player.EVENT.ON_PAUSE, onPause)
    this.player.removeEventHandler(this.player.EVENT.ON_PLAYBACK_FINISHED, onEnded)
    this.player.removeEventHandler(this.player.EVENT.ON_TIME_CHANGED, onPlayerProgress)
  }

  load(nextProps) {
    var nextUrl = nextProps.dash_url || nextProps.hls_url;
    const id = this.getID(nextUrl)
    if (this.isReady) {
      this.removeListeners()
      this.player.load(this.getConfig(nextProps).source).then(() => {
        this.player.setPosterImage(nextProps.poster)
        this.addEventListeners()
        this.props.onReady()
        this.onReady()
      })
    }
  }

  play() {
    if (!this.isReady || !this.player) return
    this.player.play()
  }

  pause() {
    if (!this.isReady || !this.player) return
    this.player && this.player.pause()
  }

  stop() {
    if (!this.isReady || !this.player) return
    this.player.pause()
  }

  seekTo(fraction) {
    super.seekTo(fraction)
    if (!this.isReady || !this.player) return
    this.player.seek(this.getDuration() * fraction)
  }

  setVolume(fraction) {
    if (!this.isReady || !this.player || !this.player.setVolume) return
    this.player.setVolume(fraction * 100)
  }

  setPlaybackRate(rate) {
    if (!this.isReady || !this.player || !this.player.setPlaybackSpeed) return
    this.player.setPlaybackSpeed(rate)
  }

  getDuration() {
    if (!this.isReady || !this.player || !this.player.getDuration) return
    return this.player.getDuration()
  }

  getFractionPlayed() {
    if (!this.isReady || !this.player || !this.player.getCurrentTime || !this.player.getDuration) return null
    return (this.player.getCurrentTime() / this.player.getDuration())
  }

  getFractionLoaded() {
    return null
  }

  render() {
    const url = this.props.dash_url || this.props.hls_url || this.props.wistia_url
    const id = this.getID(url)
    const className = `bitmovin-player-${id}`
    const style = {
      width: '100%',
      height: '100%',
      display: url ? 'block' : 'none'
    }
    return (
      <div id={className} className={className} style={style} />
    )
  }
}
