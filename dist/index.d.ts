import { PlaybackStatus, VideoProps } from 'expo';
import React from 'react';
import { Animated, TextStyle } from 'react-native';
declare enum ControlStates {
    Shown = 0,
    Showing = 1,
    Hidden = 2,
    Hiding = 3
}
declare enum PlaybackStates {
    Loading = 0,
    Playing = 1,
    Paused = 2,
    Buffering = 3,
    Error = 4,
    Ended = 5
}
declare enum SeekStates {
    NotSeeking = 0,
    Seeking = 1,
    Seeked = 2
}
declare enum ErrorSeverity {
    Fatal = 0,
    NonFatal = 1
}
interface IError {
    type: ErrorSeverity;
    message: string;
    obj: object;
}
interface State {
    playbackState: PlaybackStates;
    lastPlaybackStateUpdate: number;
    seekState: SeekStates;
    playbackInstancePosition: number;
    playbackInstanceDuration: number;
    shouldPlay: boolean;
    error: string;
    controlsOpacity: Animated.Value;
    controlsState: ControlStates;
    sliderWidth: number;
    isConnected: boolean;
}
declare const defaultProps: {
    children: React.ReactNode;
    fadeInDuration: number;
    fadeOutDuration: number;
    quickFadeOutDuration: number;
    hideControlsTimerDuration: number;
    playIcon: () => JSX.Element;
    replayIcon: () => JSX.Element;
    pauseIcon: () => JSX.Element;
    spinner: () => JSX.Element;
    fullscreenEnterIcon: () => JSX.Element;
    fullscreenExitIcon: () => JSX.Element;
    showFullscreenButton: boolean;
    iosThumbImage: any;
    iosTrackImage: any;
    textStyle: TextStyle;
    debug: boolean;
    playbackCallback: (callback: PlaybackStatus) => void;
    errorCallback: (error: IError) => void;
    switchToLandscape: () => void;
    switchToPortrait: () => void;
    showControlsOnLoad: boolean;
    sliderColor: string;
    videoProps: VideoProps;
};
declare type Props = {
    isPortrait: boolean;
} & Partial<DefaultProps>;
declare type DefaultProps = Readonly<typeof defaultProps>;
export default class VideoPlayer extends React.Component<Props, State> {
    private shouldPlayAtEndOfSeek;
    private playbackInstance;
    private showingAnimation;
    private hideAnimation;
    private controlsTimer;
    static defaultProps: {
        children: React.ReactNode;
        fadeInDuration: number;
        fadeOutDuration: number;
        quickFadeOutDuration: number;
        hideControlsTimerDuration: number;
        playIcon: () => JSX.Element;
        replayIcon: () => JSX.Element;
        pauseIcon: () => JSX.Element;
        spinner: () => JSX.Element;
        fullscreenEnterIcon: () => JSX.Element;
        fullscreenExitIcon: () => JSX.Element;
        showFullscreenButton: boolean;
        iosThumbImage: any;
        iosTrackImage: any;
        textStyle: TextStyle;
        debug: boolean;
        playbackCallback: (callback: PlaybackStatus) => void;
        errorCallback: (error: IError) => void;
        switchToLandscape: () => void;
        switchToPortrait: () => void;
        showControlsOnLoad: boolean;
        sliderColor: string;
        videoProps: VideoProps;
    };
    constructor(props: Props);
    componentWillReceiveProps(nextProps: Props): void;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    private handleConnectivityChange;
    private setPlaybackState;
    private setSeekState;
    private playbackCallback;
    private getSeekSliderPosition;
    private onSeekSliderValueChange;
    private onSeekSliderSlidingComplete;
    private isPlayingOrBufferingOrPaused;
    private onSeekBarTap;
    private onSliderLayout;
    private getMMSSFromMillis;
    private replay;
    private togglePlay;
    private toggleControls;
    private showControls;
    private hideControls;
    private onTimerDone;
    private resetControlsTimer;
    render(): JSX.Element;
}
export {};
