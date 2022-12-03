import {AVPlaybackStatus, Audio, Video} from 'expo-av'
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import {ControlStates, ErrorSeverity, PlaybackStates} from './constants'
import {
    ErrorMessage,
    TouchableButton,
    deepMerge,
    getMinutesSecondsFromMilliseconds,
    styles,
} from './utils'
import {MaterialIcons} from '@expo/vector-icons'
import {Props, defaultProps} from './props'
import {useEffect, useRef, useState} from 'react'
import React from 'react'
import Slider from '@react-native-community/slider'
import {__awaiter} from "tslib";

import DoubleClick from 'react-native-double-tap'

const VideoPlayer = (tempProps: Props) => {
    const DEFAULT_STEP_SIZE = 500;
    const DEFAULT_CONTROLS_OPACITY = 0.9;

    const props = deepMerge(defaultProps, tempProps) as Props

    let playbackInstance: Video | null = null
    let controlsTimer: NodeJS.Timeout | null = null
    let initialShow = props.defaultControlsVisible
    const header = props.header

    const [errorMessage, setErrorMessage] = useState('')
    const controlsOpacity = useRef(new Animated.Value(DEFAULT_CONTROLS_OPACITY)).current
    const [controlsState, setControlsState] = useState(
        props.defaultControlsVisible ? ControlStates.Visible : ControlStates.Hidden
    )
    const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
        position: 0,
        duration: 0,
        state: props.videoProps.source ? PlaybackStates.Loading : PlaybackStates.Error,
    })
    const [isFullscreenActive, setIsFullscreenActive] = useState(false);

    // We need to extract ref, because of misstypes in <Slider />
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {ref: sliderRef, ...sliderProps} = props.slider
    const screenRatio = props.style.width! / props.style.height!

    let videoHeight = props.style.height
    let videoWidth = videoHeight! * screenRatio

    if (videoWidth > props.style.width!) {
        videoWidth = props.style.width!
        videoHeight = videoWidth / screenRatio
    }

    useEffect(() => {
        setAudio()

        return () => {
            if (playbackInstance) {
                playbackInstance.setStatusAsync({
                    shouldPlay: false,
                })
            }
        }
    }, [])

    useEffect(() => {
        if (!props.videoProps.source) {
            console.error(
                '[VideoPlayer] `Source` is a required in `videoProps`. ' +
                'Check https://docs.expo.io/versions/latest/sdk/video/#usage'
            )
            setErrorMessage('`Source` is a required in `videoProps`')
            setPlaybackInstanceInfo({...playbackInstanceInfo, state: PlaybackStates.Error})
        } else {
            setPlaybackInstanceInfo({...playbackInstanceInfo, state: PlaybackStates.Playing})
        }
    }, [props.videoProps.source])

    const hideAnimation = () => {
        Animated.timing(controlsOpacity, {
            toValue: 0,
            duration: props.animation.fadeOutDuration,
            useNativeDriver: true,
        }).start(({finished}) => {
            if (finished) {
                setControlsState(ControlStates.Hidden)
            }
        })
    }

    const animationToggle = () => {
        if (controlsState === ControlStates.Hidden) {
            Animated.timing(controlsOpacity, {
                toValue: 1,
                duration: props.animation.fadeInDuration,
                useNativeDriver: true,
            }).start(({finished}) => {
                if (finished) {
                    setControlsState(ControlStates.Visible)
                }
            })
        } else if (controlsState === ControlStates.Visible) {
            hideAnimation()
        }

        if (controlsTimer === null && props.autoHidePlayer) {
            controlsTimer = setTimeout(() => {
                if (
                    playbackInstanceInfo.state === PlaybackStates.Playing &&
                    controlsState === ControlStates.Hidden
                ) {
                    hideAnimation()
                }
                if (controlsTimer) {
                    clearTimeout(controlsTimer)
                }
                controlsTimer = null
            }, 2000)
        }
    }

    const animationShow = () => {
        if (controlsState === ControlStates.Hidden) {
            Animated.timing(controlsOpacity, {
                toValue: 1,
                duration: props.animation.fadeInDuration,
                useNativeDriver: true,
            }).start(({finished}) => {
                if (finished) {
                    setControlsState(ControlStates.Visible);
                }
            });
        }
    };

    // Set audio mode to play even in silent mode (like the YouTube app)
    const setAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            })
        } catch (e) {
            props.errorCallback({
                type: ErrorSeverity.NonFatal,
                message: 'Audio.setAudioModeAsync',
                obj: e as Record<string, unknown>,
            })
        }
    }

    const updatePlaybackCallback = (status: AVPlaybackStatus) => {
        props.playbackCallback(status)

        if (status.isLoaded) {
            setPlaybackInstanceInfo({
                ...playbackInstanceInfo,
                position: status.positionMillis,
                duration: status.durationMillis || 0,
                state:
                    status.positionMillis === status.durationMillis
                        ? PlaybackStates.Ended
                        : status.isBuffering
                        ? PlaybackStates.Buffering
                        : status.shouldPlay
                            ? PlaybackStates.Playing
                            : PlaybackStates.Paused,
            })
            if (
                (status.didJustFinish && controlsState === ControlStates.Hidden) ||
                (status.isBuffering && controlsState === ControlStates.Hidden && initialShow)
            ) {
                animationToggle()
                initialShow = false
            }
        } else {
            if (status.isLoaded === false && status.error) {
                const errorMsg = `Encountered a fatal error during playback: ${status.error}`
                setErrorMessage(errorMsg)
                props.errorCallback({type: ErrorSeverity.Fatal, message: errorMsg, obj: {}})
            }
        }
    }

    const shiftPosition = (stepSize: number) => {
        if (controlsState === ControlStates.Hidden) {
            return;
        }

        if (playbackInstance !== null) {
            const oldPos = playbackInstanceInfo.position;
            playbackInstance.setPositionAsync(oldPos + stepSize, {
                toleranceMillisBefore: DEFAULT_STEP_SIZE / 3,
                toleranceMillisAfter: DEFAULT_STEP_SIZE / 3
            }).then(function (status) {
                // const newPos = status.positionMillis;
                // console.log('oldPos= ' + oldPos, 'newPos= ' + newPos, 'diff=  '+(newPos-oldPos));
            }).catch(function (e) {
            });
        }
    };

    const togglePlay = async () => {
        if (controlsState === ControlStates.Hidden) {
            return
        }
        const shouldPlay = playbackInstanceInfo.state !== PlaybackStates.Playing
        if (playbackInstance !== null) {
            await playbackInstance.setStatusAsync({
                shouldPlay,
                ...(playbackInstanceInfo.state === PlaybackStates.Ended && {positionMillis: 0}),
            })
            setPlaybackInstanceInfo({
                ...playbackInstanceInfo,
                state:
                    playbackInstanceInfo.state === PlaybackStates.Playing
                        ? PlaybackStates.Paused
                        : PlaybackStates.Playing,
            })
        }
    }

    const singleTapOnMiddleBtn = () => {
        togglePlay();
    }
    const doubleTapOnMiddleBtn = () => {
        toggleFullscreen();
    }

    const toggleFullscreen = () => {
        console.log('VideoPlayer toggleFullscreen');

        if(isFullscreenActive){
            setIsFullscreenActive(false);
            !props.onCancelFullscreen || props.onCancelFullscreen();
        }else{
            setIsFullscreenActive(true);
            !props.onTriggerFullscreen || props.onTriggerFullscreen();
        }



    }

    //
    // Render variants

    if (playbackInstanceInfo.state === PlaybackStates.Error) {
        return (
            <View
                style={{
                    backgroundColor: props.style.videoBackgroundColor,
                    width: videoWidth,
                    height: videoHeight,
                }}
            >
                <ErrorMessage style={props.textStyle} message={errorMessage}/>
            </View>
        )
    }

    if (playbackInstanceInfo.state === PlaybackStates.Loading) {
        return (
            <View
                style={{
                    backgroundColor: props.style.controlsBackgroundColor,
                    width: videoWidth,
                    height: videoHeight,
                    justifyContent: 'center',
                }}
            >
                {props.icon.loading || <ActivityIndicator {...props.activityIndicator} />}
            </View>
        )
    }

    return (
        <View
            style={{
                backgroundColor: props.style.videoBackgroundColor,
                width: videoWidth,
                height: videoHeight,
                maxWidth: '100%',
            }}
        >
            <Video
                style={styles.videoWrapper}
                {...props.videoProps}
                ref={component => {
                    playbackInstance = component
                    if (props.videoProps.ref) {
                        props.videoProps.ref.current = component as Video
                    }
                }}
                onPlaybackStatusUpdate={updatePlaybackCallback}
            />

            <Animated.View
                pointerEvents={controlsState === ControlStates.Visible ? 'auto' : 'none'}
                style={[
                    styles.topInfoWrapper,
                    {
                        opacity: 1,
                    },
                ]}
            >
                {header}
            </Animated.View>

            <TouchableWithoutFeedback onPress={animationShow}>
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        opacity: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            opacity: 1,
                        }}
                    />
                    <View style={styles.iconWrapperOuter}
                          pointerEvents={controlsState === ControlStates.Visible ? 'auto' : 'none'}>
                        <View style={styles.iconWrapper}>
                            <TouchableButton style={styles.touchableBtnSide} onPress={() => {
                                shiftPosition(-DEFAULT_STEP_SIZE)
                            }}>
                                <View>
                                    <MaterialIcons name='arrow-back' style={styles.iconSide} size={props.icon.size}
                                                   color={props.icon.color}/>
                                </View>
                            </TouchableButton>
                            <DoubleClick
                                singleTap={singleTapOnMiddleBtn}
                                doubleTap={doubleTapOnMiddleBtn}
                                delay={200}
                            >


                                <View>
                                    {playbackInstanceInfo.state === PlaybackStates.Buffering &&
                                    (props.icon.loading || <ActivityIndicator {...props.activityIndicator} />)}
                                    {playbackInstanceInfo.state === PlaybackStates.Playing && props.icon.pause}
                                    {playbackInstanceInfo.state === PlaybackStates.Paused && props.icon.play}
                                    {playbackInstanceInfo.state === PlaybackStates.Ended && props.icon.replay}
                                    {((playbackInstanceInfo.state === PlaybackStates.Ended && !props.icon.replay) ||
                                        (playbackInstanceInfo.state === PlaybackStates.Playing && !props.icon.pause) ||
                                        (playbackInstanceInfo.state === PlaybackStates.Paused &&
                                            !props.icon.pause)) && (
                                        <MaterialIcons
                                            name={
                                                playbackInstanceInfo.state === PlaybackStates.Playing
                                                    ? 'pause'
                                                    : playbackInstanceInfo.state === PlaybackStates.Paused
                                                    ? 'play-arrow'
                                                    : 'replay'
                                            }
                                            style={styles.iconMiddle}
                                            size={props.icon.size}
                                            color={props.icon.color}
                                        />
                                    )}
                                </View>

                            </DoubleClick>
                            <TouchableButton style={styles.touchableBtnSide} onPress={() => {
                                shiftPosition(DEFAULT_STEP_SIZE)
                            }}>
                                <View>
                                    <MaterialIcons name='arrow-forward' style={styles.iconSide} size={props.icon.size}
                                                   color={props.icon.color}/>
                                </View>
                            </TouchableButton>
                        </View>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>

            <Animated.View
                pointerEvents={controlsState === ControlStates.Visible ? 'auto' : 'none'}
                style={[
                    styles.bottomInfoWrapper,
                    {
                        opacity: controlsOpacity,
                    },
                ]}
            >
                {props.timeVisible && (
                    <Text style={[props.textStyle, styles.timeLeft]}>
                        {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.position)}
                    </Text>
                )}
                {props.slider.visible && (
                    <Slider
                        {...sliderProps}
                        style={[styles.slider, props.slider.style]}
                        value={
                            playbackInstanceInfo.duration
                                ? playbackInstanceInfo.position / playbackInstanceInfo.duration
                                : 0
                        }
                        onSlidingStart={() => {
                            if (playbackInstanceInfo.state === PlaybackStates.Playing) {
                                togglePlay()
                                setPlaybackInstanceInfo({...playbackInstanceInfo, state: PlaybackStates.Paused})
                            }
                        }}
                        onValueChange={(e) => {
                            const position = e * playbackInstanceInfo.duration;
                            if (playbackInstance) {
                                playbackInstance.setPositionAsync(position).catch(function (error) {
                                });
                            }
                            setPlaybackInstanceInfo(Object.assign(Object.assign({}, playbackInstanceInfo), {position}));
                        }}
                        onSlidingComplete={async e => {
                            const position = e * playbackInstanceInfo.duration
                            if (playbackInstance) {
                                await playbackInstance.setStatusAsync({
                                    positionMillis: position,
                                    shouldPlay: false,
                                })
                            }
                            setPlaybackInstanceInfo({
                                ...playbackInstanceInfo,
                                position,
                            })
                        }}
                    />
                )}
                {props.timeVisible && (
                    <Text style={[props.textStyle, styles.timeRight]}>
                        {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
                    </Text>
                )}
                {props.mute.visible && (
                    <TouchableButton
                        onPress={() => (props.mute.isMute ? props.mute.exitMute?.() : props.mute.enterMute?.())}
                    >
                        <View>
                            {props.icon.mute}
                            {props.icon.exitMute}
                            {((!props.icon.mute && props.mute.isMute) ||
                                (!props.icon.exitMute && !props.mute.isMute)) && (
                                <MaterialIcons
                                    name={props.mute.isMute ? 'volume-up' : 'volume-off'}
                                    style={props.icon.style}
                                    size={props.icon.size! / 2}
                                    color={props.icon.color}
                                />
                            )}
                        </View>
                    </TouchableButton>
                )}
                {props.fullscreen.visible && (
                    <TouchableButton
                        onPress={() =>
                            props.fullscreen.inFullscreen
                                ? props.fullscreen.exitFullscreen!()
                                : props.fullscreen.enterFullscreen!()
                        }
                    >
                        <View>
                            {!props.fullscreen.inFullscreen && props.icon.fullscreen}
                            {props.fullscreen.inFullscreen && props.icon.exitFullscreen}
                            {((!props.icon.fullscreen && !props.fullscreen.inFullscreen) ||
                                (!props.icon.exitFullscreen && props.fullscreen.inFullscreen)) && (
                                <MaterialIcons
                                    name={props.fullscreen.inFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                                    style={props.icon.style}
                                    size={props.icon.size! / 2}
                                    color={props.icon.color}
                                />
                            )}
                        </View>
                    </TouchableButton>
                )}
            </Animated.View>
        </View>
    )
}

VideoPlayer.defaultProps = defaultProps

export default VideoPlayer
