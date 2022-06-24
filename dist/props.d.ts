import { AVPlaybackStatus, Video, VideoProps } from 'expo-av';
import { ActivityIndicatorProps, TextStyle } from 'react-native';
import { ColorValue } from 'react-native';
import { ErrorType } from './constants';
import { MutableRefObject, ReactNode } from 'react';
import { SliderProps } from '@react-native-community/slider';
export declare type Props = RequiredProps & DefaultProps;
export declare const defaultProps: DefaultProps;
declare type RequiredProps = {
    videoProps: VideoProps & {
        ref?: MutableRefObject<Video>;
    };
};
declare type DefaultProps = {
    errorCallback: (error: ErrorType) => void;
    playbackCallback: (status: AVPlaybackStatus) => void;
    defaultControlsVisible: boolean;
    timeVisible: boolean;
    textStyle: TextStyle;
    slider: {
        visible?: boolean;
    } & SliderProps;
    activityIndicator: ActivityIndicatorProps;
    animation: {
        fadeInDuration?: number;
        fadeOutDuration?: number;
    };
    header: ReactNode;
    style: {
        width?: number;
        height?: number;
        videoBackgroundColor?: ColorValue;
        controlsBackgroundColor?: ColorValue;
    };
    icon: {
        size?: number;
        color?: ColorValue;
        style?: TextStyle;
        pause?: JSX.Element;
        play?: JSX.Element;
        replay?: JSX.Element;
        loading?: JSX.Element;
        fullscreen?: JSX.Element;
        exitFullscreen?: JSX.Element;
        mute?: JSX.Element;
        exitMute?: JSX.Element;
    };
    fullscreen: {
        enterFullscreen?: () => void;
        exitFullscreen?: () => void;
        inFullscreen?: boolean;
        visible?: boolean;
    };
    autoHidePlayer: boolean;
    mute: {
        enterMute?: () => void;
        exitMute?: () => void;
        isMute?: boolean;
        visible?: boolean;
    };
};
export {};
