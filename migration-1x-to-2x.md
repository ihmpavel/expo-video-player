# Updating to version 2.x

Some properties has been renamed, removed, but a lot of functionality has been added. Please check [README.md](https://github.com/ihmpavel/expo-video-player/blob/master/README.md)

Old property name | State | Current property name | Description
---- | :--: | :-----: | -----------
**debug** | ❌ | - | This prop has been removed
**videoProps** | ✔️ | **videoProps** | Not changed
**width** | ⚠️ | **style.width** | Property moved to the object `style`
**height** | ⚠️ | **style.height** | Property moved to the object `style`
**videoBackground** | ⚠️ | **style.videoBackground** | Property moved to the object `style`
**videoRef** | ⚠️ | **videoProps.ref** | Property moved to the object `videoProps`. See usage in the [example-app](https://github.com/ihmpavel/expo-video-player/blob/master/example-app/App.tsx)
**fadeInDuration** | ⚠️ | **animation.fadeInDuration** | Property moved to the object `animation`
**fadeOutDuration** | ⚠️ | **animation.fadeOutDuration** | Property moved to the object `animation`
**hideControlsTimerDuration** | ❌ | - | Prop has been removed
**quickFadeOutDuration** | ❌ | - | Prop has been removed
**errorCallback** | ✔️ | - | Not changed
**playbackCallback** | ✔️ | - | Not changed
**textStyle** | ✔️ | - | Not changed
**inFullscreen** | ⚠️ | **fullscreen.inFullscreen** | Property moved to the object `fullscreen`
**showFullscreenButton** | ⚠️ | **fullscreen.visible** | Property moved to the object `fullscreen`
**switchToLandscape** | ⚠️ | **fullscreen.enterFullscreen** | Property moved to the object `fullscreen`
**switchToPortrait** | ⚠️ | **fullscreen.exitFullscreen** | Property moved to the object `fullscreen`
**thumbImage** | ⚠️ | **slider.thumbImage** | Property moved to the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**iosTrackImage** | ⚠️ | **slider.trackImage** | Property moved to the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**sliderColor** | ⚠️ | **slider.minimumTrackTintColor** | Property moved to the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**disableSlider** | ⚠️ | **slider.visible** | Property moved to the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**showControlsOnLoad** | ⚠️ | **defaultControlsVisible** | Prop has been renamed
**fullscreenEnterIcon** | ⚠️ | **icon.fullscreenEnter** | Property moved to the object `icon`
**fullscreenExitIcon** | ⚠️ | **icon.fullscreenExit** | Property moved to the object `icon`
**playIcon** | ⚠️ | **icon.play** | Property moved to the object `icon`
**pauseIcon** | ⚠️ | **icon.pause** | Property moved to the object `icon`
**replayIcon** | ⚠️ | **icon.replay** | Property moved to the object `icon`
**spinner** | ⚠️ | **icon.loading** | Property moved to the object `icon`

## Guide
- ❌ - Property removed
- ⚠️ - Something changed
- ✔️ - Nothing changed
