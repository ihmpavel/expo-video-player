export declare enum ControlStates {
    Visible = "Visible",
    Hidden = "Hidden"
}
export declare enum PlaybackStates {
    Loading = "Loading",
    Playing = "Playing",
    Paused = "Paused",
    Buffering = "Buffering",
    Error = "Error",
    Ended = "Ended"
}
export declare enum ErrorSeverity {
    Fatal = "Fatal",
    NonFatal = "NonFatal"
}
export declare type ErrorType = {
    type: ErrorSeverity;
    message: string;
    obj: Record<string, unknown>;
};
