import { Platform, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View, } from 'react-native';
import React from 'react';
export const ErrorMessage = ({ message, style }) => (<View style={styles.errorWrapper}>
    <Text style={style}>{message}</Text>
  </View>);
export const getMinutesSecondsFromMilliseconds = (ms) => {
    const totalSeconds = ms / 1000;
    const seconds = String(Math.floor(totalSeconds % 60));
    const minutes = String(Math.floor(totalSeconds / 60));
    return minutes.padStart(1, '0') + ':' + seconds.padStart(2, '0');
};
export const TouchableButton = (props) => Platform.OS === 'android' ? (<TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} {...props}/>) : (<TouchableOpacity {...props}/>);
// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3585151
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepMerge = (target, source) => {
    const result = Object.assign(Object.assign({}, target), source);
    const keys = Object.keys(result);
    for (const key of keys) {
        const tprop = target[key];
        const sprop = source[key];
        if (typeof tprop === 'object' && typeof sprop === 'object') {
            result[key] = deepMerge(tprop, sprop);
        }
    }
    return result;
};
export const styles = StyleSheet.create({
    errorWrapper: Object.assign(Object.assign({}, StyleSheet.absoluteFillObject), { paddingHorizontal: 20, justifyContent: 'center' }),
    videoWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    iconWrapper: {
        borderRadius: 100,
        overflow: 'hidden',
        padding: 10,
    },
    bottomInfoWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        bottom: 0,
        left: 0,
        right: 0,
    },
    topInfoWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    timeLeft: { backgroundColor: 'transparent', marginLeft: 5 },
    timeRight: { backgroundColor: 'transparent', marginRight: 5 },
    slider: { flex: 1, paddingHorizontal: 10 },
});
