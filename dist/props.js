import { Dimensions, Platform } from 'react-native';
export const defaultProps = {
    errorCallback: error => console.error(`[VideoPlayer] ${error.type} Error - ${error.message}: ${error.obj}`),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    playbackCallback: () => { },
    defaultControlsVisible: false,
    timeVisible: true,
    slider: {
        visible: true,
    },
    textStyle: {
        color: '#FFF',
        fontSize: 12,
        textAlign: 'center',
    },
    activityIndicator: {
        size: 'large',
        color: '#999',
    },
    animation: {
        fadeInDuration: 300,
        fadeOutDuration: 300,
    },
    style: {
        width: Platform.OS === 'web' ? '100%' : Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        videoBackgroundColor: '#000',
        controlsBackgroundColor: '#000',
    },
    icon: {
        size: 48,
        color: '#FFF',
        style: {
            padding: 2,
        },
    },
    fullscreen: {
        enterFullscreen: () => 
        // eslint-disable-next-line no-console
        console.log('[VideoPlayer] - missing `enterFullscreen` function in `fullscreen` prop'),
        exitFullscreen: () => 
        // eslint-disable-next-line no-console
        console.log('[VideoPlayer] - missing `exitFullscreen` function in `fullscreen` prop'),
        inFullscreen: false,
        visible: true,
    },
    autoHidePlayer: true,
    header: undefined,
    mute: {
        enterMute: () => 
        // eslint-disable-next-line no-console
        console.log('[VideoPlayer] - missing `enterMute` function in `mute` prop'),
        exitMute: () => 
        // eslint-disable-next-line no-console
        console.log('[VideoPlayer] - missing `exitMute` function in `mute` prop'),
        isMute: false,
        visible: false,
    },
};
