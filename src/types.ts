export type Arguments = any[];

export interface LogEntry {
  timestamp: Date;
  identifier: string;
  args?: Arguments;
  parent?: LogEntry;
  children: LogEntry[];
}

export interface StringifyOptions {
  showTimestamp?: boolean;
  useColor?: boolean;
  stringProviderMethodName?: string;
}

export interface State {
  isEnabled: boolean;
  root: LogEntry;
  head: LogEntry;
}
