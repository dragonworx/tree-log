export type Arguments = any[];

export interface LogDetail {
  timestamp: Date;
  label: string;
}

export interface LogNode extends LogDetail {
  parent?: LogNode;
  children: Array<LogItem>;
}

export interface LogEntry extends LogDetail {
  data?: Arguments;
  children?: LogEntry[];
}

export interface LogTrace extends LogEntry {
  depth?: number;
  isLastChild?: boolean;
  isNode?: boolean;
}

export interface LogTraceDetail {
  depth: number;
  isLastChild: boolean;
  isNode: boolean;
}

export type LogItem = LogNode | LogEntry;

export interface State {
  options: LogOptions;
  root: LogNode;
  head: LogNode;
}

export interface LogOptions {
  enabled: boolean;
  showTimeStamp: boolean;
  useTimeDelta: boolean;
  useColor: boolean;
  stringProviderMethodName: string;
}
