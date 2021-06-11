export var ControlStates;
(function (ControlStates) {
    ControlStates["Visible"] = "Visible";
    ControlStates["Hidden"] = "Hidden";
})(ControlStates || (ControlStates = {}));
export var PlaybackStates;
(function (PlaybackStates) {
    PlaybackStates["Loading"] = "Loading";
    PlaybackStates["Playing"] = "Playing";
    PlaybackStates["Paused"] = "Paused";
    PlaybackStates["Buffering"] = "Buffering";
    PlaybackStates["Error"] = "Error";
    PlaybackStates["Ended"] = "Ended";
})(PlaybackStates || (PlaybackStates = {}));
export var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["Fatal"] = "Fatal";
    ErrorSeverity["NonFatal"] = "NonFatal";
})(ErrorSeverity || (ErrorSeverity = {}));
