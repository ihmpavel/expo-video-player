/// <reference types="react" />
import { AVPlaybackStatus } from 'expo-av';
import { Props } from './props';
declare const VideoPlayer: {
    (props: Props): JSX.Element;
    defaultProps: {
        errorCallback: (error: import("./constants").ErrorType) => void;
        playbackCallback: (status: AVPlaybackStatus) => void;
        debug: boolean;
        textStyle: import("react-native").TextStyle;
        defaultControlsVisible: boolean;
        slider: {
            visible: boolean;
        } & import("@react-native-community/slider").SliderProps;
        activityIndicator: import("react-native").ActivityIndicatorProps;
        animation: {
            fadeInDuration: number;
            fadeOutDuration: number;
        };
        style: {
            width: number;
            height: number;
            videoBackgroundColor: import("react-native").ColorValue;
            controlsBackgroundColor: import("react-native").ColorValue;
        };
        icon: {
            size: number;
            color: import("react-native").ColorValue;
            style: import("react-native").TextStyle;
            pause?: JSX.Element | undefined;
            play?: JSX.Element | undefined;
            replay?: JSX.Element | undefined;
            fullscreen?: JSX.Element | undefined;
            exitFullscreen?: JSX.Element | undefined;
        };
        timeVisible: boolean;
        fullscreen: {
            enterFullscreen: () => void;
            exitFullscreen: () => void;
            inFullscreen: boolean;
            visible: boolean;
        };
    };
};
export default VideoPlayer;
