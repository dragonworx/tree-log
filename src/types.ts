export type Data = any[];

export interface LogEntry {
  timestamp: Date;
  data?: Data;
  parent?: LogEntry;
  children: LogEntry[];
}

export interface StringifyOptions {
  indentChar?: string;
  showTimestamp?: boolean;
  useColor?: boolean;
  stringProviderMethodName?: string;
}

export interface State {
  isEnabled: boolean;
  root: LogEntry;
  head: LogEntry;
}
