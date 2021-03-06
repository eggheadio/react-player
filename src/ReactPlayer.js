import React, { Component } from 'react'
import omit from 'lodash.omit'

import { propTypes, defaultProps } from './props'
import YouTube from './players/YouTube'
import SoundCloud from './players/SoundCloud'
import Vimeo from './players/Vimeo'
import Facebook from './players/Facebook'
import FilePlayer from './players/FilePlayer'
import Streamable from './players/Streamable'
import Vidme from './players/Vidme'
import Wistia from './players/Wistia'
import Bitmovin from './players/Bitmovin'
import DailyMotion from './players/DailyMotion'


export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps
  componentDidMount () {
    this.progress()
  }
  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
  }
  shouldComponentUpdate (nextProps) {
    const url = this.props.dash_url || this.props.hls_url || this.props.wistia_url
    const nextUrl = nextProps.dash_url || nextProps.hls_url || nextProps.wistia_url
    return (
      url !== nextUrl ||
      this.props.playing !== nextProps.playing ||
      this.props.volume !== nextProps.volume ||
      this.props.playbackRate !== nextProps.playbackRate ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.hidden !== nextProps.hidden
    )
  }
  seekTo = fraction => {
    if (this.player) {
      this.player.seekTo(fraction)
    }
  }
  getDuration = () => {
    if (!this.player) return null
    return this.player.getDuration()
  }
  getCurrentTime = () => {
    if (!this.player) return null
    const duration = this.player.getDuration()
    const fractionPlayed = this.player.getFractionPlayed()
    if (duration === null || fractionPlayed === null) {
      return null
    }
    return fractionPlayed * duration
  }
  progress = () => {
    const hasUrl = this.props.dash_url || this.props.hls_url || this.props.wistia_url
    if (hasUrl && this.player) {
      const loaded = this.player.getFractionLoaded() || 0
      const played = this.player.getFractionPlayed() || 0
      const duration = this.player.getDuration()
      const progress = {}
      if (loaded !== this.prevLoaded) {
        progress.loaded = loaded
        if (duration) {
          progress.loadedSeconds = progress.loaded * duration
        }
      }
      if (played !== this.prevPlayed) {
        progress.played = played
        if (duration) {
          progress.playedSeconds = progress.played * duration
        }
      }
      if (progress.loaded || progress.played) {
        this.props.onProgress(progress)
      }
      this.prevLoaded = loaded
      this.prevPlayed = played

    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency)
  }
  renderPlayers () {
    // Build array of players to render based on URL and preload config
    const { youtubeConfig, vimeoConfig, dailymotionConfig } = this.props
    const url = this.props.dash_url || this.props.hls_url || this.props.wistia_url

    const players = []
    if (YouTube.canPlay(url)) {
      players.push(YouTube)
    } else if (Bitmovin.canPlay(url)) {
      players.push(Bitmovin)
    } else if (SoundCloud.canPlay(url)) {
      players.push(SoundCloud)
    } else if (Vimeo.canPlay(url)) {
      players.push(Vimeo)
    } else if (Facebook.canPlay(url)) {
      players.push(Facebook)
    } else if (DailyMotion.canPlay(url)) {
      players.push(DailyMotion)
    } else if (Streamable.canPlay(url)) {
      players.push(Streamable)
    } else if (Vidme.canPlay(url)) {
      players.push(Vidme)
    } else if (Wistia.canPlay(url)) {
      players.push(Wistia)
    } else if (url) {
      // Fall back to FilePlayer if nothing else can play the URL
      players.push(FilePlayer)
    }
    // Render additional players if preload config is set
    if (!YouTube.canPlay(url) && youtubeConfig.preload) {
      players.push(YouTube)
    }
    if (!Vimeo.canPlay(url) && vimeoConfig.preload) {
      players.push(Vimeo)
    }
    if (!DailyMotion.canPlay(url) && dailymotionConfig.preload) {
      players.push(DailyMotion)
    }
    return players.map(this.renderPlayer)
  }
  ref = player => {
    this.player = player
  }
  renderPlayer = Player => {
    const url = this.props.dash_url || this.props.hls_url || this.props.wistia_url
    const active = Player.canPlay(url)
    const { youtubeConfig, vimeoConfig, dailymotionConfig, ...activeProps } = this.props
    const props = active ? { ...activeProps, ref: this.ref } : {}
    // Only youtube and vimeo config passed to
    // inactive players due to preload behaviour
    return (
      <Player
        key={Player.displayName}
        youtubeConfig={youtubeConfig}
        vimeoConfig={vimeoConfig}
        dailymotionConfig={dailymotionConfig}
        {...props}
      />
    )
  }
  render () {
    const { style, width, height } = this.props
    const otherProps = omit(this.props, Object.keys(propTypes))
    const players = this.renderPlayers()
    return (
      <div style={{ ...style, width, height }} {...otherProps}>
        {players}
      </div>
    )
  }
}
