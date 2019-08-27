import * as tslib_1 from "tslib";
import { Animated, Dimensions, Slider, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { Audio, Video } from 'expo-av';
import { FullscreenEnterIcon, FullscreenExitIcon, PauseIcon, PlayIcon, ReplayIcon, Spinner, } from './assets/icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { withDefaultProps } from 'with-default-props';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IOS_THUMB_IMAGE = require('./assets/thumb.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const IOS_TRACK_IMAGE = require('./assets/track.png');
const SLIDER_COLOR = '#009485';
const BUFFERING_SHOW_DELAY = 200;
// UI states
var ControlStates;
(function (ControlStates) {
    ControlStates[ControlStates["Shown"] = 0] = "Shown";
    ControlStates[ControlStates["Showing"] = 1] = "Showing";
    ControlStates[ControlStates["Hidden"] = 2] = "Hidden";
    ControlStates[ControlStates["Hiding"] = 3] = "Hiding";
})(ControlStates || (ControlStates = {}));
var PlaybackStates;
(function (PlaybackStates) {
    PlaybackStates[PlaybackStates["Loading"] = 0] = "Loading";
    PlaybackStates[PlaybackStates["Playing"] = 1] = "Playing";
    PlaybackStates[PlaybackStates["Paused"] = 2] = "Paused";
    PlaybackStates[PlaybackStates["Buffering"] = 3] = "Buffering";
    PlaybackStates[PlaybackStates["Error"] = 4] = "Error";
    PlaybackStates[PlaybackStates["Ended"] = 5] = "Ended";
})(PlaybackStates || (PlaybackStates = {}));
var SeekStates;
(function (SeekStates) {
    SeekStates[SeekStates["NotSeeking"] = 0] = "NotSeeking";
    SeekStates[SeekStates["Seeking"] = 1] = "Seeking";
    SeekStates[SeekStates["Seeked"] = 2] = "Seeked";
})(SeekStates || (SeekStates = {}));
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity[ErrorSeverity["Fatal"] = 0] = "Fatal";
    ErrorSeverity[ErrorSeverity["NonFatal"] = 1] = "NonFatal";
})(ErrorSeverity || (ErrorSeverity = {}));
const defaultProps = {
    children: null,
    debug: false,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // Animations
    fadeInDuration: 200,
    fadeOutDuration: 1000,
    quickFadeOutDuration: 200,
    hideControlsTimerDuration: 4000,
    // Icons
    playIcon: PlayIcon,
    replayIcon: ReplayIcon,
    pauseIcon: PauseIcon,
    spinner: Spinner,
    fullscreenEnterIcon: FullscreenEnterIcon,
    fullscreenExitIcon: FullscreenExitIcon,
    // Appearance
    showFullscreenButton: true,
    iosThumbImage: IOS_THUMB_IMAGE,
    iosTrackImage: IOS_TRACK_IMAGE,
    textStyle: {
        color: '#FFF',
        fontSize: 12,
    },
    videoBackground: '#000',
    // Callbacks
    errorCallback: (error) => console.error('Error: ', error.message, error.type, error.obj),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    playbackCallback: () => undefined,
    switchToLandscape: () => console.warn(`Pass in this function 'switchToLandscape in props to enable fullscreening`),
    switchToPortrait: () => console.warn(`Pass in this function 'switchToPortrait in props to enable fullscreening`),
    showControlsOnLoad: false,
    sliderColor: SLIDER_COLOR,
};
const VideoPlayer = (props) => {
    let playbackInstance = null;
    let showingAnimation = null;
    let hideAnimation = null;
    let shouldPlayAtEndOfSeek = false;
    let controlsTimer = null;
    const { isConnected } = useNetInfo();
    const [playbackState, setPlaybackState] = useState(PlaybackStates.Loading);
    const [lastPlaybackStateUpdate, setLastPlaybackStateUpdate] = useState(Date.now());
    const [seekState, setSeekState] = useState(SeekStates.NotSeeking);
    const [playbackInstancePosition, setPlaybackInstancePosition] = useState(0);
    const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(0);
    const [shouldPlay, setShouldPlay] = useState(false);
    const [error, setError] = useState('');
    const [sliderWidth, setSliderWidth] = useState(0);
    const [controlsState, setControlsState] = useState(props.showControlsOnLoad ? ControlStates.Shown : ControlStates.Hidden);
    const [controlsOpacity, setControlsOpacity] = useState(new Animated.Value(props.showControlsOnLoad ? 1 : 0));
    // Set audio mode to play even in silent mode (like the YouTube app)
    const setAudio = async () => {
        const { errorCallback } = props;
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: false,
            });
        }
        catch (e) {
            errorCallback({
                type: ErrorSeverity.NonFatal,
                message: 'setAudioModeAsync error',
                obj: e,
            });
        }
    };
    // https://usehooks.com/useEventListener/
    useEffect(() => {
        const { videoProps } = props;
        if (videoProps.source === null) {
            console.error('`Source` is a required property');
            throw new Error('`Source` is required');
        }
        setAudio();
    });
    // Handle events during playback
    const updatePlaybackState = (newPlaybackState) => {
        if (playbackState !== newPlaybackState) {
            const { debug } = props;
            debug &&
                console.info('[playback]', PlaybackStates[playbackState], ' -> ', PlaybackStates[newPlaybackState], ' [seek] ', SeekStates[seekState], ' [shouldPlay] ', shouldPlay);
            setPlaybackState(newPlaybackState);
            setLastPlaybackStateUpdate(Date.now());
        }
    };
    const updateSeekState = (newSeekState) => {
        const { debug } = props;
        debug &&
            console.info('[seek]', SeekStates[seekState], ' -> ', SeekStates[newSeekState], ' [playback] ', PlaybackStates[playbackState], ' [shouldPlay] ', shouldPlay);
        setSeekState(newSeekState);
        // Don't keep the controls timer running when the state is seeking
        if (newSeekState === SeekStates.Seeking) {
            controlsTimer && clearTimeout(controlsTimer);
        }
        else {
            // Start the controlFs timer anew
            resetControlsTimer();
        }
    };
    const updatePlaybackCallback = (status) => {
        const { errorCallback, playbackCallback } = props;
        try {
            playbackCallback(status);
        }
        catch (e) {
            console.error('Uncaught error when calling props.playbackCallback', e);
        }
        if (!status.isLoaded) {
            if (status.error) {
                updatePlaybackState(PlaybackStates.Error);
                const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
                setError(errorMsg);
                errorCallback({ type: ErrorSeverity.Fatal, message: errorMsg, obj: {} });
            }
        }
        else {
            // Update current position, duration, and `shouldPlay`
            setPlaybackInstancePosition(status.positionMillis || 0);
            setPlaybackInstanceDuration(status.durationMillis || 0);
            setShouldPlay(status.shouldPlay);
            // Figure out what state should be next (only if we are not seeking,
            // other the seek action handlers control the playback state, not this callback)
            if (seekState === SeekStates.NotSeeking && playbackState !== PlaybackStates.Ended) {
                if (status.didJustFinish && !status.isLooping) {
                    updatePlaybackState(PlaybackStates.Ended);
                }
                else {
                    // If the video is buffering but there is no Internet, you go to the Error state
                    if (!isConnected && status.isBuffering) {
                        updatePlaybackState(PlaybackStates.Error);
                        setError('You are probably offline. Please make sure you are connected to the Internet to watch this video');
                    }
                    else {
                        updatePlaybackState(isPlayingOrBufferingOrPaused(status));
                    }
                }
            }
        }
    };
    // Seeking
    const getSeekSliderPosition = () => {
        if (playbackInstance !== null
        // WILL IT HAPPEN? &&
        // playbackInstancePosition !== null &&
        // playbackInstanceDuration !== null
        ) {
            return playbackInstancePosition / playbackInstanceDuration;
        }
        return 0;
    };
    const onSeekSliderValueChange = async () => {
        if (playbackInstance !== null && seekState !== SeekStates.Seeking) {
            updateSeekState(SeekStates.Seeking);
            // A seek might have finished (Seeked) but since we are not in NotSeeking yet, the `shouldPlay` flag is still false,
            // but we really want it be the stored value from before the previous seek
            shouldPlayAtEndOfSeek = seekState === SeekStates.Seeked ? shouldPlayAtEndOfSeek : shouldPlay;
            // Pause the video
            await playbackInstance.setStatusAsync({ shouldPlay: false });
        }
    };
    const onSeekSliderSlidingComplete = async (value) => {
        if (playbackInstance !== null) {
            const { debug } = props;
            // Seeking is done, so go to Seeked, and set playbackState to Buffering
            updateSeekState(SeekStates.Seeked);
            // If the video is going to play after seek, the user expects a spinner.
            // Otherwise, the user expects the play button
            updatePlaybackState(shouldPlayAtEndOfSeek ? PlaybackStates.Buffering : PlaybackStates.Paused);
            try {
                const playback = await playbackInstance.setStatusAsync({
                    positionMillis: value * playbackInstanceDuration,
                    shouldPlay: shouldPlayAtEndOfSeek,
                });
                // The underlying <Video> has successfully updated playback position
                // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to Paused?
                // But because we setStatusAsync(shouldPlay: false), so the playbackStatus return value will be Paused.
                updateSeekState(SeekStates.NotSeeking);
                updatePlaybackState(isPlayingOrBufferingOrPaused(playback));
            }
            catch (e) {
                debug && console.error('Seek error: ', e);
            }
        }
    };
    const isPlayingOrBufferingOrPaused = (status) => {
        if (!status.isLoaded) {
            return PlaybackStates.Error;
        }
        if (status.isPlaying) {
            return PlaybackStates.Playing;
        }
        if (status.isBuffering) {
            return PlaybackStates.Buffering;
        }
        return PlaybackStates.Paused;
    };
    const onSeekBarTap = (e) => {
        if (!(playbackState === PlaybackStates.Loading ||
            playbackState === PlaybackStates.Ended ||
            playbackState === PlaybackStates.Error ||
            controlsState !== ControlStates.Shown)) {
            const value = e.nativeEvent.locationX / sliderWidth;
            onSeekSliderValueChange();
            onSeekSliderSlidingComplete(value);
        }
    };
    // Capture the width of the seekbar slider for use in `_onSeekbarTap`
    const onSliderLayout = (e) => {
        setSliderWidth(e.nativeEvent.layout.width);
    };
    // Controls view
    const getMMSSFromMillis = (millis) => {
        const totalSeconds = millis / 1000;
        const seconds = String(Math.floor(totalSeconds % 60));
        const minutes = String(Math.floor(totalSeconds / 60));
        return minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0');
    };
    // Controls Behavior
    const replay = async () => {
        if (playbackInstance !== null) {
            await playbackInstance.setStatusAsync({
                shouldPlay: true,
                positionMillis: 0,
            });
            // Update playbackState to get out of Ended state
            setPlaybackState(PlaybackStates.Playing);
        }
    };
    const togglePlay = async () => {
        if (controlsState === ControlStates.Hidden) {
            return;
        }
        const shouldPlay = playbackState !== PlaybackStates.Playing;
        if (playbackInstance !== null) {
            await playbackInstance.setStatusAsync({ shouldPlay });
        }
    };
    const toggleControls = () => {
        switch (controlsState) {
            case ControlStates.Shown:
                // If the controls are currently Shown, a tap should hide controls quickly
                setControlsState(ControlStates.Hiding);
                hideControls(true);
                break;
            case ControlStates.Hidden:
                // If the controls are currently, show controls with fade-in animation
                showControls();
                setControlsState(ControlStates.Showing);
                break;
            case ControlStates.Hiding:
                // If controls are fading out, a tap should reverse, and show controls
                setControlsState(ControlStates.Showing);
                showControls();
                break;
            case ControlStates.Showing:
                // A tap when the controls are fading in should do nothing
                break;
        }
    };
    const showControls = () => {
        const { fadeInDuration } = props;
        showingAnimation = Animated.timing(controlsOpacity, {
            toValue: 1,
            duration: fadeInDuration,
            useNativeDriver: true,
        });
        showingAnimation.start(({ finished }) => {
            if (finished) {
                setControlsState(ControlStates.Shown);
                resetControlsTimer();
            }
        });
    };
    const hideControls = (immediately = false) => {
        const { quickFadeOutDuration, fadeOutDuration } = props;
        if (controlsTimer) {
            clearTimeout(controlsTimer);
        }
        hideAnimation = Animated.timing(controlsOpacity, {
            toValue: 0,
            duration: immediately ? quickFadeOutDuration : fadeOutDuration,
            useNativeDriver: true,
        });
        hideAnimation.start(({ finished }) => {
            if (finished) {
                setControlsState(ControlStates.Hidden);
            }
        });
    };
    const onTimerDone = () => {
        // After the controls timer runs out, fade away the controls slowly
        setControlsState(ControlStates.Hiding);
        hideControls();
    };
    const resetControlsTimer = () => {
        const { hideControlsTimerDuration } = props;
        if (controlsTimer) {
            clearTimeout(controlsTimer);
        }
        controlsTimer = setTimeout(() => onTimerDone(), hideControlsTimerDuration);
    };
    const { playIcon: VideoPlayIcon, pauseIcon: VideoPauseIcon, spinner: VideoSpinner, fullscreenEnterIcon: VideoFullscreenEnterIcon, fullscreenExitIcon: VideoFullscreenExitIcon, replayIcon: VideoReplayIcon, switchToLandscape, switchToPortrait, isPortrait, sliderColor, iosThumbImage, iosTrackImage, showFullscreenButton, textStyle, videoProps, videoBackground, width, height, } = props;
    const centeredContentWidth = 60;
    const screenRatio = width / height;
    let videoHeight = height;
    let videoWidth = videoHeight * screenRatio;
    if (videoWidth > width) {
        videoWidth = props.width;
        videoHeight = videoWidth / screenRatio;
    }
    // Do not let the user override `ref`, `callback`, and `style`
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref, style, onPlaybackStatusUpdate, source } = videoProps, otherVideoProps = tslib_1.__rest(videoProps, ["ref", "style", "onPlaybackStatusUpdate", "source"]);
    const Control = (_a) => {
        var { callback, center, children, transparent = false } = _a, otherProps = tslib_1.__rest(_a, ["callback", "center", "children", "transparent"]);
        return (<TouchableOpacity {...otherProps} hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }} onPress={() => {
            resetControlsTimer();
            callback();
        }}>
      <View style={center && {
            backgroundColor: transparent ? 'transparent' : 'rgba(0, 0, 0, 0.4)',
            justifyContent: 'center',
            width: centeredContentWidth,
            height: centeredContentWidth,
            borderRadius: centeredContentWidth,
        }}>
        {children}
      </View>
    </TouchableOpacity>);
    };
    const CenteredView = (_a) => {
        var { children, style: viewStyle } = _a, 
        // pointerEvents,
        otherProps = tslib_1.__rest(_a, ["children", "style"]);
        return (<Animated.View {...otherProps} style={[
            {
                position: 'absolute',
                left: (videoWidth - centeredContentWidth) / 2,
                top: (videoHeight - centeredContentWidth) / 2,
                width: centeredContentWidth,
                height: centeredContentWidth,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            },
            viewStyle,
        ]}>
      {children}
    </Animated.View>);
    };
    const ErrorText = ({ text }) => (<View style={{
        position: 'absolute',
        top: videoHeight / 2,
        width: videoWidth - 40,
        marginRight: 20,
        marginLeft: 20,
    }}>
      <Text style={[textStyle, { textAlign: 'center' }]}>{text}</Text>
    </View>);
    return (<TouchableWithoutFeedback onPress={toggleControls}>
      <View style={{ backgroundColor: videoBackground }}>
        <Video source={source} ref={component => {
        playbackInstance = component;
        ref && ref(component);
    }} onPlaybackStatusUpdate={updatePlaybackCallback} style={{
        width: videoWidth,
        height: videoHeight,
    }} {...otherVideoProps}/>

        
        
        {((playbackState === PlaybackStates.Buffering &&
        Date.now() - lastPlaybackStateUpdate > BUFFERING_SHOW_DELAY) ||
        playbackState === PlaybackStates.Loading) && (<View style={[
        {
            position: 'absolute',
            left: (videoWidth - centeredContentWidth) / 2,
            top: (videoHeight - centeredContentWidth) / 2,
            width: centeredContentWidth,
            height: centeredContentWidth,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    ]}>
            <VideoSpinner />
          </View>)}

        
        {seekState !== SeekStates.Seeking &&
        (playbackState === PlaybackStates.Playing || playbackState === PlaybackStates.Paused) && (<CenteredView pointerEvents={controlsState === ControlStates.Hidden ? 'none' : 'auto'} 
    // @ts-ignore
    style={{
        opacity: controlsOpacity,
    }}>
              <Control center={true} callback={togglePlay}>
                {playbackState === PlaybackStates.Playing ? <VideoPauseIcon /> : <VideoPlayIcon />}
              </Control>
            </CenteredView>)}

        
        {playbackState === PlaybackStates.Ended && (<CenteredView>
            <Control center={true} callback={replay}>
              <VideoReplayIcon />
            </Control>
          </CenteredView>)}

        
        {playbackState === PlaybackStates.Error && <ErrorText text={error}/>}

        
        <Animated.View pointerEvents={controlsState === ControlStates.Hidden ? 'none' : 'auto'} style={{
        position: 'absolute',
        bottom: 0,
        width: videoWidth,
        opacity: controlsOpacity,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 4,
        paddingHorizontal: 4,
    }}>
          
          <Text style={[textStyle, { backgroundColor: 'transparent', marginLeft: 5 }]}>
            {getMMSSFromMillis(playbackInstancePosition)}
          </Text>

          
          <TouchableWithoutFeedback onLayout={onSliderLayout} onPress={onSeekBarTap}>
            <Slider style={{ marginRight: 10, marginLeft: 10, flex: 1 }} thumbTintColor={sliderColor} minimumTrackTintColor={sliderColor} trackImage={iosTrackImage} thumbImage={iosThumbImage} value={getSeekSliderPosition()} onValueChange={onSeekSliderValueChange} onSlidingComplete={onSeekSliderSlidingComplete} disabled={playbackState === PlaybackStates.Loading ||
        playbackState === PlaybackStates.Ended ||
        playbackState === PlaybackStates.Error ||
        controlsState !== ControlStates.Shown}/>
          </TouchableWithoutFeedback>

          
          <Text style={[textStyle, { backgroundColor: 'transparent', marginRight: 5 }]}>
            {getMMSSFromMillis(playbackInstanceDuration)}
          </Text>

          
          {showFullscreenButton && (<Control transparent={true} center={false} callback={() => {
        isPortrait ? switchToLandscape() : switchToPortrait();
    }}>
              {isPortrait ? <VideoFullscreenEnterIcon /> : <VideoFullscreenExitIcon />}
            </Control>)}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>);
};
export default withDefaultProps(VideoPlayer, defaultProps);
