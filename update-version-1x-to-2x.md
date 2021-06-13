# Updating to version 2.x

Some properties has been renamed, removed, but a lot of functionality has been added. Please check [README.md](https://github.com/ihmpavel/expo-video-player/tree/master/README.md)

old prop | state | current prop | description
---- | :--: | :-----: | -----------
**debug** | ❌ | - | This prop has been removed
**videoProps** | ✔️ | **videoProps** | Not changed
**width** | ⚠️ | **style.width** | Prop now lives in the object `style`
**height** | ⚠️ | **style.height** | Prop now lives in the object `style`
**videoBackground** | ⚠️ | **style.videoBackground** | Prop now lives in the object `style`
**videoRef** | ⚠️ | **videoProps.ref** | Prop now lives in the object `videoProps`. See usage in the [example-app](https://github.com/ihmpavel/expo-video-player/tree/master/example-app/App.tsx)
**fadeInDuration** | ⚠️ | **animation.fadeInDuration** | Prop now lives in the object `animation`
**fadeOutDuration** | ⚠️ | **animation.fadeOutDuration** | Prop now lives in the object `animation`
**hideControlsTimerDuration** | ❌ | - | Prop has been removed
**quickFadeOutDuration** | ❌ | - | Prop has been removed
**errorCallback** | ✔️ | - | Not changed
**playbackCallback** | ✔️ | - | Not changed
**textStyle** | ✔️ | - | Not changed
**inFullscreen** | ⚠️ | **fullscreen.inFullscreen** | Prop now lives in the object `fullscreen`
**showFullscreenButton** | ⚠️ | **fullscreen.visible** | Prop now lives in the object `fullscreen`
**switchToLandscape** | ⚠️ | **fullscreen.enterFullscreen** | Prop now lives in the object `fullscreen`
**switchToPortrait** | ⚠️ | **fullscreen.exitFullscreen** | Prop now lives in the object `fullscreen`
**thumbImage** | ⚠️ | **slider.thumbImage** | Prop now lives in the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**iosTrackImage** | ⚠️ | **slider.trackImage** | Prop now lives in the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**sliderColor** | ⚠️ | **slider.minimumTrackTintColor** | Prop now lives in the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**disableSlider** | ⚠️ | **slider.visible** | Prop now lives in the object `slider`. You can use any of the props (except `ref`, `value`, `onSlidingStart` and `onSlidingComplete`) from [@react-native-community/slider](https://github.com/callstack/react-native-slider)
**showControlsOnLoad** | ⚠️ | **defaultControlsVisible** | Prop has been renamed
**fullscreenEnterIcon** | ⚠️ | **icon.fullscreenEnter** | Prop now lives in the object `icon`
**fullscreenExitIcon** | ⚠️ | **icon.fullscreenExit** | Prop now lives in the object `icon`
**playIcon** | ⚠️ | **icon.play** | Prop now lives in the object `icon`
**pauseIcon** | ⚠️ | **icon.pause** | Prop now lives in the object `icon`
**replayIcon** | ⚠️ | **icon.replay** | Prop now lives in the object `icon`
**spinner** | ❌ | - | You can use prop `activityIndicator`
