import { StyleSheet, Text, View } from 'react-native';
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
export const styles = StyleSheet.create({
    errorWrapper: Object.assign(Object.assign({}, StyleSheet.absoluteFillObject), { paddingHorizontal: 20, justifyContent: 'center' }),
    videoWrapper: { flex: 1 },
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
    timeLeft: { backgroundColor: 'transparent', marginLeft: 5 },
    timeRight: { backgroundColor: 'transparent', marginRight: 5 },
});
