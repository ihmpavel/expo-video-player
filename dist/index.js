import * as tslib_1 from "tslib";
import { Audio, Video } from 'expo';
import React from 'react';
import { Animated, Dimensions, NetInfo, Slider, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { FullscreenEnterIcon, FullscreenExitIcon, PauseIcon, PlayIcon, ReplayIcon, Spinner } from './assets/icons';
const IOS_TRACK_IMAGE = require('./assets/track.png');
const IOS_THUMB_IMAGE = require('./assets/thumb.png');
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
// DEFAULT PROPS -> https://github.com/Hotell/rex-tils/blob/6709b504c4c8714d9b703ade08f5593a4807479d/src/react/default-props.ts
const createPropsGetter = (dp) => {
    return (props) => {
        // tslint:disable-next-line:no-any
        return props;
    };
};
const defaultProps = {
    children: null,
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
    // Callbacks
    debug: false,
    playbackCallback: (callback) => undefined,
    errorCallback: (error) => console.error('Error: ', error.message, error.type, error.obj),
    switchToLandscape: () => console.warn(`Pass in this function 'switchToLandscape' 
    in props to enable fullscreening`),
    switchToPortrait: () => console.warn(`Pass in this function 'switchToPortrait' 
    in props to enable fullscreening`),
    showControlsOnLoad: false,
    sliderColor: SLIDER_COLOR,
    // Expo props
    videoProps: {}
};
const getProps = createPropsGetter(defaultProps);
export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.shouldPlayAtEndOfSeek = false;
        this.playbackInstance = null;
        this.showingAnimation = null;
        this.hideAnimation = null;
        this.controlsTimer = null;
        this.handleConnectivityChange = (isConnected) => {
            const { debug } = getProps(this.props);
            if (isConnected) {
                this.setState({ isConnected });
            }
            else {
                this.setState({ isConnected });
            }
            debug && console.log(`User is ${isConnected ? 'on' : 'off'}line`);
        };
        this.onSeekSliderValueChange = () => {
            if (this.playbackInstance !== null &&
                this.state.seekState !== SeekStates.Seeking) {
                this.setSeekState(SeekStates.Seeking);
                // A seek might have finished (Seeked) but since we are not in NotSeeking yet, the `shouldPlay` flag is still false,
                // but we really want it be the stored value from before the previous seek
                this.shouldPlayAtEndOfSeek =
                    this.state.seekState === SeekStates.Seeked
                        ? this.shouldPlayAtEndOfSeek
                        : this.state.shouldPlay;
                // Pause the video
                this.playbackInstance.setStatusAsync({ shouldPlay: false });
            }
        };
        this.onSeekSliderSlidingComplete = async (value) => {
            const { debug } = getProps(this.props);
            if (this.playbackInstance !== null) {
                // Seeking is done, so go to Seeked, and set playbackState to Buffering
                this.setSeekState(SeekStates.Seeked);
                // If the video is going to play after seek, the user expects a spinner.
                // Otherwise, the user expects the play button
                this.setPlaybackState(this.shouldPlayAtEndOfSeek
                    ? PlaybackStates.Buffering
                    : PlaybackStates.Paused);
                try {
                    const playback = await this.playbackInstance
                        .setStatusAsync({
                        positionMillis: value * this.state.playbackInstanceDuration,
                        shouldPlay: this.shouldPlayAtEndOfSeek,
                    });
                    // The underlying <Video> has successfully updated playback position
                    // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to Paused?
                    // But because we setStatusAsync(shouldPlay: false), so the playbackStatus return value will be Paused.
                    this.setSeekState(SeekStates.NotSeeking);
                    this.setPlaybackState(this.isPlayingOrBufferingOrPaused(playback));
                }
                catch (e) {
                    debug && console.error('Seek error: ', e);
                }
            }
        };
        this.isPlayingOrBufferingOrPaused = (status) => {
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
        this.onSeekBarTap = (e) => {
            if (!(this.state.playbackState === PlaybackStates.Loading ||
                this.state.playbackState === PlaybackStates.Ended ||
                this.state.playbackState === PlaybackStates.Error ||
                this.state.controlsState !== ControlStates.Shown)) {
                const value = e.nativeEvent.locationX / this.state.sliderWidth;
                this.onSeekSliderValueChange();
                this.onSeekSliderSlidingComplete(value);
            }
        };
        // Capture the width of the seekbar slider for use in `_onSeekbarTap`
        this.onSliderLayout = (e) => {
            this.setState({ sliderWidth: e.nativeEvent.layout.width });
        };
        this.toggleControls = () => {
            switch (this.state.controlsState) {
                case ControlStates.Shown:
                    // If the controls are currently Shown, a tap should hide controls quickly
                    this.setState({ controlsState: ControlStates.Hiding });
                    this.hideControls(true);
                    break;
                case ControlStates.Hidden:
                    // If the controls are currently, show controls with fade-in animation
                    this.showControls();
                    this.setState({ controlsState: ControlStates.Showing });
                    break;
                case ControlStates.Hiding:
                    // If controls are fading out, a tap should reverse, and show controls
                    this.setState({ controlsState: ControlStates.Showing });
                    this.showControls();
                    break;
                case ControlStates.Showing:
                    // A tap when the controls are fading in should do nothing
                    break;
            }
        };
        this.showControls = () => {
            const { fadeInDuration } = getProps(this.props);
            this.showingAnimation = Animated.timing(this.state.controlsOpacity, {
                toValue: 1,
                duration: fadeInDuration,
                useNativeDriver: true,
            });
            this.showingAnimation.start(({ finished }) => {
                if (finished) {
                    this.setState({ controlsState: ControlStates.Shown });
                    this.resetControlsTimer();
                }
            });
        };
        this.hideControls = (immediate = false) => {
            const { quickFadeOutDuration, fadeOutDuration } = getProps(this.props);
            if (this.controlsTimer) {
                clearTimeout(this.controlsTimer);
            }
            this.hideAnimation = Animated.timing(this.state.controlsOpacity, {
                toValue: 0,
                duration: immediate
                    ? quickFadeOutDuration
                    : fadeOutDuration,
                useNativeDriver: true,
            });
            this.hideAnimation.start(({ finished }) => {
                if (finished) {
                    this.setState({ controlsState: ControlStates.Hidden });
                }
            });
        };
        this.onTimerDone = () => {
            // After the controls timer runs out, fade away the controls slowly
            this.setState({ controlsState: ControlStates.Hiding });
            this.hideControls();
        };
        this.resetControlsTimer = () => {
            const { hideControlsTimerDuration } = getProps(this.props);
            if (this.controlsTimer) {
                clearTimeout(this.controlsTimer);
            }
            this.controlsTimer = setTimeout(() => this.onTimerDone(), hideControlsTimerDuration);
        };
        const { videoProps, showControlsOnLoad } = getProps(props);
        if (videoProps && videoProps.source === null) {
            console.error('`Source` is a required property');
            throw new Error('`Source` is required');
        }
        this.state = {
            // Playback state
            playbackState: PlaybackStates.Loading,
            lastPlaybackStateUpdate: Date.now(),
            // Seeking state
            seekState: SeekStates.NotSeeking,
            // State comes from the playbackCallback
            playbackInstancePosition: 0,
            playbackInstanceDuration: 0,
            shouldPlay: false,
            // Error message if we are in PlaybackStates.Error
            error: '',
            // Controls display state
            controlsOpacity: new Animated.Value(showControlsOnLoad ? 1 : 0),
            controlsState: showControlsOnLoad
                ? ControlStates.Shown
                : ControlStates.Hidden,
            sliderWidth: 0,
            isConnected: true
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.videoProps && nextProps.videoProps.source == null) {
            throw new Error('`Source` is a required property');
        }
    }
    async componentDidMount() {
        const { errorCallback } = getProps(this.props);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        if (this.state.controlsState === ControlStates.Shown) {
            this.resetControlsTimer();
        }
        // Set audio mode to play even in silent mode (like the YouTube app)
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                playThroughEarpieceAndroid: false
            });
        }
        catch (e) {
            errorCallback({
                type: ErrorSeverity.NonFatal,
                message: 'setAudioModeAsync error',
                obj: e,
            });
        }
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }
    // Handle events during playback
    setPlaybackState(playbackState) {
        const { debug } = getProps(this.props);
        if (this.state.playbackState !== playbackState) {
            debug &&
                console.log('[playback]', this.state.playbackState, ' -> ', playbackState, ' [seek] ', this.state.seekState, ' [shouldPlay] ', this.state.shouldPlay);
            this.setState({ playbackState, lastPlaybackStateUpdate: Date.now() });
        }
    }
    setSeekState(seekState) {
        const { debug } = getProps(this.props);
        debug &&
            console.log('[seek]', this.state.seekState, ' -> ', seekState, ' [playback] ', this.state.playbackState, ' [shouldPlay] ', this.state.shouldPlay);
        this.setState({ seekState });
        // Don't keep the controls timer running when the state is seeking
        if (seekState === SeekStates.Seeking) {
            this.controlsTimer && clearTimeout(this.controlsTimer);
        }
        else {
            // Start the controlFs timer anew
            this.resetControlsTimer();
        }
    }
    playbackCallback(status) {
        const { errorCallback, playbackCallback } = getProps(this.props);
        try {
            playbackCallback(status);
        }
        catch (e) {
            console.error('Uncaught error when calling props.playbackCallback', e);
        }
        if (!status.isLoaded) {
            if (status.error) {
                this.setPlaybackState(PlaybackStates.Error);
                const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
                this.setState({
                    error: errorMsg,
                });
                errorCallback({ type: ErrorSeverity.Fatal, message: errorMsg, obj: {} });
            }
        }
        else {
            // Update current position, duration, and `shouldPlay`
            this.setState({
                playbackInstancePosition: status.positionMillis || 0,
                playbackInstanceDuration: status.durationMillis || 0,
                shouldPlay: status.shouldPlay,
            });
            // Figure out what state should be next (only if we are not seeking,
            // other the seek action handlers control the playback state, not this callback)
            if (this.state.seekState === SeekStates.NotSeeking &&
                this.state.playbackState !== PlaybackStates.Ended) {
                if (status.didJustFinish && !status.isLooping) {
                    this.setPlaybackState(PlaybackStates.Ended);
                }
                else {
                    // If the video is buffering but there is no Internet, you go to the Error state
                    if (!this.state.isConnected && status.isBuffering) {
                        this.setPlaybackState(PlaybackStates.Error);
                        this.setState({
                            error: 'You are probably offline. Please make sure you are ' +
                                'connected to the Internet to watch this video',
                        });
                    }
                    else {
                        this.setPlaybackState(this.isPlayingOrBufferingOrPaused(status));
                    }
                }
            }
        }
    }
    // Seeking
    getSeekSliderPosition() {
        if (this.playbackInstance !== null &&
            this.state.playbackInstancePosition !== null &&
            this.state.playbackInstanceDuration !== null) {
            return (this.state.playbackInstancePosition /
                this.state.playbackInstanceDuration);
        }
        return 0;
    }
    // Controls view
    getMMSSFromMillis(millis) {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);
        const padWithZero = (n) => {
            const str = n.toString();
            if (n < 10) {
                return '0' + str;
            }
            return str;
        };
        return padWithZero(minutes) + ':' + padWithZero(seconds);
    }
    // Controls Behavior
    async replay() {
        if (this.playbackInstance !== null) {
            await this.playbackInstance
                .setStatusAsync({
                shouldPlay: true,
                positionMillis: 0,
            });
            // Update playbackState to get out of Ended state
            this.setState({ playbackState: PlaybackStates.Playing });
        }
    }
    togglePlay() {
        const shouldPlay = this.state.playbackState !== PlaybackStates.Playing;
        if (this.playbackInstance !== null) {
            this.playbackInstance.setStatusAsync({ shouldPlay });
        }
    }
    render() {
        const { width: maxWidth, height: maxHeight } = Dimensions.get('window');
        const centeredContentWidth = 60;
        const screenRatio = Dimensions.get('window').width / Dimensions.get('window').height;
        let videoHeight = maxHeight;
        let videoWidth = videoHeight * screenRatio;
        if (videoWidth > maxWidth) {
            videoWidth = maxWidth;
            videoHeight = videoWidth / screenRatio;
        }
        const { playIcon: PlayIconElem, pauseIcon: PauseIconElem, spinner: SpinnerElem, fullscreenEnterIcon: FullscreenEnterIconElem, fullscreenExitIcon: FullscreenExitIconElem, replayIcon: ReplayIconElem, switchToLandscape, switchToPortrait, isPortrait, sliderColor, iosThumbImage, iosTrackImage, showFullscreenButton, textStyle, videoProps } = getProps(this.props);
        // Do not let the user override `ref`, `callback`, and `style`
        const { ref, style, onPlaybackStatusUpdate, source } = videoProps, otherVideoProps = tslib_1.__rest(videoProps, ["ref", "style", "onPlaybackStatusUpdate", "source"]);
        const Control = (_a) => {
            var { callback, center, children, transparent = false } = _a, otherProps = tslib_1.__rest(_a, ["callback", "center", "children", "transparent"]);
            return (<TouchableOpacity {...otherProps} hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }} onPress={() => {
                this.resetControlsTimer();
                callback();
            }}>
        <View style={center
                ? {
                    backgroundColor: transparent ? 'transparent' : 'rgba(0, 0, 0, 0.4)',
                    justifyContent: 'center',
                    width: centeredContentWidth,
                    height: centeredContentWidth,
                    borderRadius: centeredContentWidth,
                }
                : {}}>
          {children}
        </View>
      </TouchableOpacity>);
        };
        const CenteredView = (_a) => {
            var { children, style: viewStyle, pointerEvents } = _a, otherProps = tslib_1.__rest(_a, ["children", "style", "pointerEvents"]);
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
        <Text style={[textStyle, { textAlign: 'center' }]}>
          {text}
        </Text>
      </View>);
        return (<TouchableWithoutFeedback onPress={() => this.toggleControls()}>
        <View style={{ backgroundColor: 'black' }}>
          <Video source={source} ref={component => {
            this.playbackInstance = component;
            ref && ref(component);
        }} onPlaybackStatusUpdate={(status) => this.playbackCallback(status)} style={{
            width: videoWidth,
            height: videoHeight,
        }} {...otherVideoProps}/>

          
          
          {((this.state.playbackState === PlaybackStates.Buffering &&
            Date.now() - this.state.lastPlaybackStateUpdate > BUFFERING_SHOW_DELAY)
            ||
                this.state.playbackState === PlaybackStates.Loading) && (<View style={[
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
              <SpinnerElem />
            </View>)}

          
          {(this.state.seekState === SeekStates.NotSeeking ||
            this.state.seekState === SeekStates.Seeked) &&
            (this.state.playbackState === PlaybackStates.Playing ||
                this.state.playbackState === PlaybackStates.Paused) && (<CenteredView pointerEvents={this.state.controlsState === ControlStates.Hidden
            ? 'none'
            : 'auto'} style={{
            opacity: this.state.controlsOpacity,
        }}>
              <Control center={true} callback={() => this.togglePlay()}>
                {this.state.playbackState === PlaybackStates.Playing
            ? <PauseIconElem />
            : <PlayIconElem />}
              </Control>
            </CenteredView>)}

          
          {this.state.playbackState === PlaybackStates.Ended && (<CenteredView>
              <Control center={true} callback={() => this.replay()}>
                <ReplayIconElem />
              </Control>
            </CenteredView>)}

          
          {this.state.playbackState === PlaybackStates.Error && (<ErrorText text={this.state.error}/>)}

          
          <Animated.View pointerEvents={this.state.controlsState === ControlStates.Hidden
            ? 'none'
            : 'auto'} style={{
            position: 'absolute',
            bottom: 0,
            width: videoWidth,
            opacity: this.state.controlsOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 4,
            paddingHorizontal: 4
        }}>
            
            <Text style={[
            textStyle,
            { backgroundColor: 'transparent', marginLeft: 5 },
        ]}>
              {this.getMMSSFromMillis(this.state.playbackInstancePosition)}
            </Text>

            
            <TouchableWithoutFeedback onLayout={e => this.onSliderLayout(e)} onPress={e => this.onSeekBarTap(e)}>
              <Slider style={{ marginRight: 10, marginLeft: 10, flex: 1 }} thumbTintColor={sliderColor} minimumTrackTintColor={sliderColor} trackImage={iosTrackImage} thumbImage={iosThumbImage} value={this.getSeekSliderPosition()} onValueChange={this.onSeekSliderValueChange} onSlidingComplete={this.onSeekSliderSlidingComplete} disabled={this.state.playbackState === PlaybackStates.Loading ||
            this.state.playbackState === PlaybackStates.Ended ||
            this.state.playbackState === PlaybackStates.Error ||
            this.state.controlsState !== ControlStates.Shown}/>
            </TouchableWithoutFeedback>

            
            <Text style={[
            textStyle,
            { backgroundColor: 'transparent', marginRight: 5 },
        ]}>
              {this.getMMSSFromMillis(this.state.playbackInstanceDuration)}
            </Text>

            
            {showFullscreenButton &&
            <Control transparent={true} center={false} callback={() => {
                isPortrait
                    ? switchToLandscape()
                    : switchToPortrait();
            }}>
              {isPortrait
                ? <FullscreenEnterIconElem />
                : <FullscreenExitIconElem />}
            </Control>}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>);
    }
}
VideoPlayer.defaultProps = defaultProps;
