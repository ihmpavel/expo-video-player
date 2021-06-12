import { AVPlaybackStatus, Video, VideoProps } from 'expo-av'
import { ActivityIndicatorProps, Dimensions, TextStyle } from 'react-native'
import { ColorValue } from 'react-native'
import { ErrorType } from './constants'
import { MutableRefObject } from 'react'
import { SliderProps } from '@react-native-community/slider'

// https://github.com/typescript-cheatsheets/react/issues/415
export type Props = RequiredProps & DefaultProps

export const defaultProps = {
  errorCallback: error =>
    console.error(`[VideoPlayer] ${error.type} Error - ${error.message}: ${error.obj}`),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  playbackCallback: () => {},
  textStyle: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  defaultControlsVisible: false,
  slider: {
    visible: true,
  },
  activityIndicator: {
    size: 'large',
    color: '#999',
  },
  animation: {
    fadeInDuration: 300,
    fadeOutDuration: 300,
  },
  style: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    videoBackgroundColor: '#000',
    controlsBackgroundColor: '#000',
  },
  icon: {
    size: 48,
    color: '#FFF',
    style: {
      padding: 2,
    },
  },
  timeVisible: true,
  fullscreen: {
    enterFullscreen: () =>
      // eslint-disable-next-line no-console
      console.log('[VideoPlayer] - missing `enterFullscreen` function in `fullscreen` prop'),
    exitFullscreen: () =>
      // eslint-disable-next-line no-console
      console.log('[VideoPlayer] - missing `exitFullscreen` function in `fullscreen` prop'),
    inFullscreen: false,
    visible: true,
  },
} as DefaultProps

type RequiredProps = {
  videoProps: VideoProps & {
    ref?: MutableRefObject<Video>
  }
}

type DefaultProps = {
  errorCallback: (error: ErrorType) => void
  playbackCallback: (status: AVPlaybackStatus) => void
  textStyle: TextStyle
  defaultControlsVisible: boolean
  slider: {
    visible?: boolean
  } & SliderProps
  activityIndicator: ActivityIndicatorProps
  animation: {
    fadeInDuration?: number
    fadeOutDuration?: number
  }
  style: {
    width?: number
    height?: number
    videoBackgroundColor?: ColorValue
    controlsBackgroundColor?: ColorValue
  }
  icon: {
    size?: number
    color?: ColorValue
    style?: TextStyle
    pause?: JSX.Element
    play?: JSX.Element
    replay?: JSX.Element
    fullscreen?: JSX.Element
    exitFullscreen?: JSX.Element
  }
  timeVisible: boolean
  fullscreen: {
    enterFullscreen?: () => void
    exitFullscreen?: () => void
    inFullscreen?: boolean
    visible?: boolean
  }
}
