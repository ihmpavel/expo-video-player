import { AVPlaybackStatus } from 'expo-av';
import { Props } from './props';
import React from 'react';
declare const VideoPlayer: {
    (tempProps: Props): JSX.Element;
    defaultProps: {
        errorCallback: (error: import("./constants").ErrorType) => void;
        playbackCallback: (status: AVPlaybackStatus) => void;
        defaultControlsVisible: boolean;
        timeVisible: boolean;
        textStyle: import("react-native").TextStyle;
        slider: {
            visible?: boolean | undefined;
        } & import("@react-native-community/slider").SliderProps;
        activityIndicator: import("react-native").ActivityIndicatorProps;
        animation: {
            fadeInDuration?: number | undefined;
            fadeOutDuration?: number | undefined;
        };
        header: React.ReactNode;
        style: {
            width?: number | undefined;
            height?: number | undefined;
            videoBackgroundColor?: import("react-native").ColorValue | undefined;
            controlsBackgroundColor?: import("react-native").ColorValue | undefined;
        };
        icon: {
            size?: number | undefined;
            color?: import("react-native").ColorValue | undefined;
            style?: import("react-native").TextStyle | undefined;
            pause?: JSX.Element | undefined;
            play?: JSX.Element | undefined;
            replay?: JSX.Element | undefined;
            loading?: JSX.Element | undefined;
            fullscreen?: JSX.Element | undefined;
            exitFullscreen?: JSX.Element | undefined;
            mute?: JSX.Element | undefined;
            exitMute?: JSX.Element | undefined;
        };
        fullscreen: {
            enterFullscreen?: (() => void) | undefined;
            exitFullscreen?: (() => void) | undefined;
            inFullscreen?: boolean | undefined;
            visible?: boolean | undefined;
        };
        autoHidePlayer: boolean;
        mute: {
            enterMute?: (() => void) | undefined;
            exitMute?: (() => void) | undefined;
            isMute?: boolean | undefined;
            visible?: boolean | undefined;
        };
    };
};
export default VideoPlayer;
