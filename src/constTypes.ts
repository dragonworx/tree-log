export type Arguments = any[];

export const isBrowser = typeof window !== 'undefined';

export const RootLabel = '__root__';

export const defaultLogOptions: LogOptions = {
  enabled: true,
  showTimeStamp: true,
  useTimeDelta: false,
  useColor: true,
  stringProviderMethodName: 'toLogInfo',
};

export const state: State = (() => {
  const root: LogNode = {
    timestamp: new Date(),
    label: RootLabel,
    children: [],
  };

  return {
    hasWarned: false,
    options: defaultLogOptions,
    root,
    head: root,
  };
})();

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
  hasWarned: boolean;
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

export interface ColorOptions {
  bold?: boolean;
  underline?: boolean;
}
