import { ImageURISource, TextStyle } from 'react-native';
import { Color } from 'csstype';
import { PlaybackStatus } from 'expo-av/build/AV';
import { VideoProps } from 'expo-av/build/Video';
import { ReactNode } from 'react';
declare enum ErrorSeverity {
    Fatal = 0,
    NonFatal = 1
}
declare type Error = {
    type: ErrorSeverity;
    message: string;
    obj: object;
};
declare type Props = {
    videoProps: VideoProps;
    isPortrait: boolean;
    width: number;
    height: number;
    children: ReactNode;
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
    iosThumbImage: ImageURISource;
    iosTrackImage: ImageURISource;
    textStyle: TextStyle;
    videoBackground: Color;
    debug: boolean;
    playbackCallback: (callback: PlaybackStatus) => void;
    errorCallback: (error: Error) => void;
    switchToLandscape: () => void;
    switchToPortrait: () => void;
    showControlsOnLoad: boolean;
    sliderColor: Color;
};
declare const _default: (props: Pick<Props, "isPortrait" | "videoProps"> & {
    spinner?: (() => JSX.Element) | undefined;
    children?: null | undefined;
    height?: number | undefined;
    width?: number | undefined;
    playIcon?: (() => JSX.Element) | undefined;
    pauseIcon?: (() => JSX.Element) | undefined;
    fullscreenEnterIcon?: (() => JSX.Element) | undefined;
    fullscreenExitIcon?: (() => JSX.Element) | undefined;
    replayIcon?: (() => JSX.Element) | undefined;
    switchToLandscape?: (() => void) | undefined;
    switchToPortrait?: (() => void) | undefined;
    sliderColor?: string | undefined;
    iosThumbImage?: any;
    iosTrackImage?: any;
    showFullscreenButton?: boolean | undefined;
    textStyle?: {
        color: string;
        fontSize: number;
    } | undefined;
    videoBackground?: string | undefined;
    errorCallback?: ((error: Error) => void) | undefined;
    debug?: boolean | undefined;
    playbackCallback?: (() => undefined) | undefined;
    fadeInDuration?: number | undefined;
    quickFadeOutDuration?: number | undefined;
    fadeOutDuration?: number | undefined;
    hideControlsTimerDuration?: number | undefined;
    showControlsOnLoad?: boolean | undefined;
}, ref?: unknown) => JSX.Element;
export default _default;
