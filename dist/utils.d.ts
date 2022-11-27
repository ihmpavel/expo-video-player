import { TextStyle, TouchableNativeFeedbackProps, TouchableOpacityProps } from 'react-native';
import React from 'react';
export declare const ErrorMessage: ({ message, style }: {
    message: string;
    style: TextStyle;
}) => JSX.Element;
export declare const getMinutesSecondsFromMilliseconds: (ms: number) => string;
type ButtonProps = (TouchableNativeFeedbackProps | TouchableOpacityProps) & {
    children: React.ReactNode;
};
export declare const TouchableButton: (props: ButtonProps) => JSX.Element;
export declare const deepMerge: (target: {
    [x: string]: any;
}, source: {
    [x: string]: any;
}) => {
    [x: string]: any;
};
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
        justifyContent: "center";
    };
    iconWrapperOuter: {
        flex: number;
        alignSelf: "stretch";
    };
    iconWrapper: {
        alignItems: "center";
        flexDirection: "row";
        flex: number;
        alignSelf: "stretch";
        opacity: number;
    };
    touchableBtnSide: {
        alignSelf: "stretch";
        justifyContent: "center";
        flex: number;
        alignItems: "center";
    };
    touchableBtnMiddle: {
        alignSelf: "stretch";
        justifyContent: "center";
        alignItems: "center";
    };
    iconSide: {
        padding: number;
        fontSize: number;
    };
    iconMiddle: {
        padding: number;
        fontSize: number;
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
    topInfoWrapper: {
        position: "absolute";
        flexDirection: "row";
        alignItems: "center";
        justifyContent: "space-between";
        flex: number;
        top: number;
        left: number;
        right: number;
        zIndex: number;
    };
    timeLeft: {
        backgroundColor: string;
        marginLeft: number;
    };
    timeRight: {
        backgroundColor: string;
        marginRight: number;
    };
    slider: {
        flex: number;
        paddingHorizontal: number;
    };
};
export {};
