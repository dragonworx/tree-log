export interface LogEntry {
  timestamp: Date;
  data?: any[];
  parent?: LogEntry;
  children: LogEntry[];
}

export interface StringifyOptions {
  indentChar?: string;
  showTimestamp?: boolean;
}

export interface State {
  isEnabled: boolean;
  root: LogEntry;
  head: LogEntry;
}
