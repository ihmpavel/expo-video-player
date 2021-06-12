import { Dimensions } from 'react-native';
export const defaultProps = {
    errorCallback: error => console.error(`[VideoPlayer] ${error.type} Error - ${error.message}: ${error.obj}`),
    // eslint-disable-next-line
    playbackCallback: () => { },
    textStyle: {
        color: '#FFF',
        fontSize: 12,
        textAlign: 'center',
    },
    defaultControlsVisible: false,
    slider: {
        visible: true,
    },
    activityIndicator: {
        size: 'large',
        color: '#999',
    },
    animation: {
        fadeInDuration: 400,
        fadeOutDuration: 400,
    },
    style: {
        width: Dimensions.get('window').width,
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
    timeVisible: true,
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
};
