/// <reference types="react" />
import { TextStyle } from 'react-native';
export declare const ErrorMessage: ({ message, style }: {
    message: string;
    style: TextStyle;
}) => JSX.Element;
export declare const getMinutesSecondsFromMilliseconds: (ms: number) => string;
export declare const styles: {
    errorWrapper: {
        paddingHorizontal: number;
        justifyContent: "center";
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
    videoWrapper: {
        flex: number;
    };
    iconWrapper: {
        borderRadius: number;
        overflow: "hidden";
        padding: number;
    };
    bottomInfoWrapper: {
        position: "absolute";
        flexDirection: "row";
        alignItems: "center";
        justifyContent: "space-between";
        flex: number;
        bottom: number;
        left: number;
        right: number;
    };
    timeLeft: {
        backgroundColor: string;
        marginLeft: number;
    };
    timeRight: {
        backgroundColor: string;
        marginRight: number;
    };
};
