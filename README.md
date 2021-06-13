# Basic info
Video component for Expo built on top of the Expo's [Video component](https://docs.expo.io/versions/latest/sdk/video/). This library basically adds UI controls like in the YouTube app, which gives you the opportunity to play, pause, replay, change video position and a lot of styling options.

The package has a lot of configuration options to fit all your needs. Only `source` in `videoProps: { source: {} }` is required. Check the <a href='#props'>Props</a> table below.

For compatibility information, check <a href='#compatibility'>Compatibility</a>. The FAQ is <a href='#faq'>here</a>

## ⚠️ Updating from version 1.x to 2.x
If you are updating from version 1.x to 2.x, there are some breaking changes in the API. Please visit [Migration guide to version 2](https://github.com/ihmpavel/expo-video-player/tree/master/update-version-1x-to-2x.md) to make your transition as easy as possible.

## Installation
- Install Expo video player running `yarn add expo-video-player` _or_ `npm install expo-video-player`
- You also need `expo-av` and `@react-native-community/slider`. Install them with `expo-cli` (`expo install expo-av @react-native-community/slider`)

## Usage
An Example app with various examples can be found in the folder [example-app](https://github.com/ihmpavel/expo-video-player/tree/master/example-app).

```
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'

<VideoPlayer
  videoProps={{
    shouldPlay: true,
    resizeMode: Video.RESIZE_MODE_CONTAIN,
    // ❗ source is required
    source: {
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  }}
/>
```

## Props
For default prop values, please check [/lib/props.tsx](https://github.com/ihmpavel/expo-video-player/blob/master/lib/props.tsx#L11)
prop | type | description
---- | :-------: | -----------
**videoProps** | [`VideoProps`](https://docs.expo.io/versions/latest/sdk/video/#props) | At least `source` is required
**errorCallback** | (error: ErrorType) => void | Function, which is fired when an error occurs
**playbackCallback** | (status: AVPlaybackStatus) => void | Function, which is fired every time `onPlaybackStatusUpdate` occurs
**defaultControlsVisible** | `boolean` | Control, if on video start is visible darker overlay with icons. Default is `false`
**timeVisible** | `boolean` | Show current time and final length in the bottom. Default is `true`
**textStyle** | `TextStyle` | Object containing `<Text />` styling
**slider** | `{ visible?: boolean } & SliderProps` | Object containing any of [@react-native-community/slider](https://github.com/callstack/react-native-slider) props. Styling may break layout. Also hide slider by providing `visible: false` prop. You are unable to overwrite `ref`, `value`, `onSlidingStart` and `onSlidingComplete`
**activityIndicator** | `ActivityIndicatorProps` | Any values from [ActivityIndicator](https://reactnative.dev/docs/activityindicator)
**animation** | `{ fadeInDuration?: number, fadeOutDuration?: number }` | Duration of animations in milliseconds
**style** | `{ width?: number, height?: number, videoBackgroundColor?: ColorValue, controlsBackgroundColor?: ColorValue }` | Basic styling of `<VideoPlayer />`
**icon** | `{ size?: number, color?: ColorValue, style?: TextStyle, pause?: JSX.Element, play?: JSX.Element, replay?: JSX.Element, fullscreen?: JSX.Element, exitFullscreen?: JSX.Element }` | Icon styling. Check more in the [example-app](https://github.com/ihmpavel/expo-video-player/tree/master/example-app/App.tsx)
**fullscreen** | `{ enterFullscreen?: () => void, exitFullscreen?: () => void, inFullscreen?: boolean, visible?: boolean }` | Usage of `Fullscreen` mode is in the [example-app](https://github.com/ihmpavel/expo-video-player/tree/master/example-app/App.tsx)

## Compatibility
Library version | Expo SDK version
---- | -------
2.x.x | >= SDK 38
1.6.x | >= SDK 38
1.5.x | >= SDK 34
1.4.x | >= SDK 34
1.3.x | >= SDK 34
1.2.x | >= SDK 33
1.1.x | >= SDK 32
1.x.x | >= SDK 32

### CHANGELOG
Changelog added in version 1.3.0
Read [CHANGELOG.md](https://github.com/ihmpavel/expo-video-player/tree/master/CHANGELOG.md)

### FAQ
- **How to achieve fullscreen?** Please check [example-app](https://github.com/ihmpavel/expo-video-player/tree/master/example-app/App.tsx)
- **How to use ref?** Please check [example-app](https://github.com/ihmpavel/expo-video-player/tree/master/example-app/App.tsx)
- **What to do, if I disconnect from the internet while playing online video?** You need to stop/pause playback yourself. I highly recommend using [@react-native-community/netinfo](https://github.com/react-native-netinfo/react-native-netinfo) for this kind of stuff
- **Do you support subtitles?** Please check [#1](https://github.com/ihmpavel/expo-video-player/issues/1)
- **Can I support you?** Yes, please [Become a sponsor](https://github.com/sponsors/ihmpavel)

### TODO
- [ ] make tests

#### Some articles
 - Inspired by [expo/videoplayer](https://github.com/expo/videoplayer) _(already deprecated)_
 - [Typescript default props](https://github.com/typescript-cheatsheets/react/issues/415)
 - [Creating a typescript module](https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724)
 - [Creating a component for React](https://medium.com/@BrodaNoel/how-to-create-a-react-component-and-publish-it-in-npm-668ad7d363ce)
