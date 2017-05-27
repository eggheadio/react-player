import React from 'react'
import loadScript from 'load-script'
import {isFunction} from 'lodash'

import Base from './Base'

const SDK_URL = '//bitmovin-a.akamaihd.net/bitmovin-player/stable/7/bitmovinplayer.js'
const SDK_GLOBAL = 'bitmovin'
const MATCH_URL = /^(https?:\/\/d2c5owlt6rorc3.cloudfront.net\/)(.[^_]*)_(.[^/]*)\/(.*)$/

export default class Wistia extends Base {
  static displayName = 'Bitmovin'

  static canPlay(url) {
    return MATCH_URL.test(url)
  }

  getConfig() {
    return {
      key: "56231f1a-2845-4d2e-a432-07436d3f4958",
      source: {
        dash: this.props.url
      },
      skin: {screenLogoImage: ""}
    };
  }

  componentDidMount() {
    const {onTimechange, onPause, onEnded} = this.props
    const id = this.getID(this.props.url)
    const className = `bitmovin-player-${id}`

    this.loadingSDK = true
    this.getSDK().then((script) => {
      this.loadingSDK = false
      this.player = window.bitmovin.player(className);
      this.player.setup(this.getConfig()).then((value) => {
        this.player.addEventHandler(this.player.EVENT.ON_TIME_CHANGED, onTimechange)
        this.player.addEventHandler(this.player.EVENT.ON_PLAY, this.onPlay)
        this.player.addEventHandler(this.player.EVENT.ON_PAUSE, onPause)
        this.player.addEventHandler(this.player.EVENT.ON_PLAYBACK_FINISHED, onEnded)
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

  load(url) {
    const id = this.getID(url)
    if (this.isReady) {
      this.player.replaceWith(id)
      this.props.onReady()
      this.onReady()
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
    const id = this.getID(this.props.url)
    const className = `bitmovin-player-${id}`
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }
    return (
      <div id={className} className={className} style={style} />
    )
  }
}
