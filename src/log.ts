import { LogNode, LogEntry, State, LogOptions } from './types';
import { entryToString } from './format';
import { flatten } from './write';

const RootLabel = '__root__';

export const defaultLogOptions: LogOptions = {
  enabled: false,
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
    options: defaultLogOptions,
    root,
    head: root,
  };
})();

export function log(label: string, ...data: any[]) {
  if (!state.options.enabled) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date(),
    label,
    data,
  };

  state.head.children.push(entry);
}

export function pushLog(label: string) {
  if (!state.options.enabled) {
    return;
  }

  const node: LogNode = {
    timestamp: new Date(),
    label,
    parent: state.head,
    children: [],
  };

  state.head.children.push(node);
  state.head = node;
}

export function popLog() {
  if (!state.options.enabled) {
    return;
  }

  if (state.head.parent) {
    state.head = state.head.parent;
  }
}

export function renderLog() {
  const flat = flatten(true);
  const buffer: Array<string> = [];

  flat.forEach((entry, i) => {
    buffer.push(
      entryToString(
        entry,
        i > 0 ? flat[i - 1] : entry,
        {
          depth: entry.depth!,
          isLastChild: entry.isLastChild!,
          isNode: entry.isNode!,
        },
        state.options,
        entry.isLastChild,
      ),
    );
  });

  return buffer.join('\n');
}

export function setLogOptions(options: Partial<LogOptions>) {
  state.options = {
    ...state.options,
    ...options,
  };
}

export function clearLog() {
  state.root = state.head = {
    timestamp: new Date(),
    label: RootLabel,
    children: [],
  };
}
