export type Arguments = any[];

export interface LogDetail {
  timestamp: Date;
  identifier: string;
}

export interface LogNode extends LogDetail {
  parent?: LogNode;
  children: Array<LogItem>;
}

export interface LogEntry extends LogDetail {
  data?: Arguments;
}

export type LogItem = LogNode | LogEntry;

export interface StringifyOptions {
  showTimestamp?: boolean;
  useTimeDelta?: boolean;
  useColor?: boolean;
  stringProviderMethodName?: string;
  isLastChild?: boolean;
}

export interface State {
  isEnabled: boolean;
  root: LogNode;
  head: LogNode;
}
