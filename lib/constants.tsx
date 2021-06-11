export enum ControlStates {
  Visible = 'Visible',
  Hidden = 'Hidden',
}

export enum PlaybackStates {
  Loading = 'Loading',
  Playing = 'Playing',
  Paused = 'Paused',
  Buffering = 'Buffering',
  Error = 'Error',
  Ended = 'Ended',
}

export enum ErrorSeverity {
  Fatal = 'Fatal',
  NonFatal = 'NonFatal',
}

export type ErrorType = {
  type: ErrorSeverity
  message: string
  obj: Record<string, unknown>
}
