/// <reference types="react" />
import { AVPlaybackStatus } from 'expo-av';
import { Props } from './props';
declare const VideoPlayer: {
    (tempProps: Props): JSX.Element;
    defaultProps: {
        errorCallback: (error: import("./constants").ErrorType) => void;
        playbackCallback: (status: AVPlaybackStatus) => void;
        textStyle: import("react-native").TextStyle;
        defaultControlsVisible: boolean;
        slider: {
            visible?: boolean | undefined;
        } & import("@react-native-community/slider").SliderProps;
        activityIndicator: import("react-native").ActivityIndicatorProps;
        animation: {
            fadeInDuration?: number | undefined;
            fadeOutDuration?: number | undefined;
        };
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
            fullscreen?: JSX.Element | undefined;
            exitFullscreen?: JSX.Element | undefined;
        };
        timeVisible: boolean;
        fullscreen: {
            enterFullscreen?: (() => void) | undefined;
            exitFullscreen?: (() => void) | undefined;
            inFullscreen?: boolean | undefined;
            visible?: boolean | undefined;
        };
    };
};
export default VideoPlayer;
