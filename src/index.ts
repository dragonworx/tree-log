import {
  LogNode,
  LogEntry,
  StringifyOptions,
  State,
  LogItem,
  LogDetail,
  LogTrace,
  LogTraceDetail,
} from "./types";
import { entryToString } from "./format";

const RootIdentifier = "__root__";

const state: State = (() => {
  const root: LogNode = {
    timestamp: new Date(),
    identifier: RootIdentifier,
    children: [],
  };

  return {
    isEnabled: true,
    root,
    head: root,
  };
})();

export function log(identifier: string, ...data: any[]) {
  if (!state.isEnabled) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date(),
    identifier,
    data,
  };

  state.head.children.push(entry);
}

export function push(identifier: string) {
  if (!state.isEnabled) {
    return;
  }

  const node: LogNode = {
    timestamp: new Date(),
    identifier,
    parent: state.head,
    children: [],
  };

  state.head.children.push(node);
  state.head = node;
}

export function pop() {
  if (!state.isEnabled) {
    return;
  }

  if (state.head.parent) {
    state.head = state.head.parent;
  }
}

export function flatten(withDetail: boolean = false) {
  const buffer: Array<LogTrace> = [];
  _flatten(
    state.root,
    buffer,
    withDetail ? { depth: -2, isLastChild: false, isNode: true } : undefined
  );
  return buffer;
}

function _flatten(
  entry: LogEntry,
  buffer: Array<LogTrace>,
  info?: LogTraceDetail
) {
  if (isNode(entry)) {
    if (!isRoot(entry)) {
      buffer.push({
        timestamp: entry.timestamp,
        identifier: entry.identifier,
        depth: info ? info.depth + 1 : undefined,
        isLastChild: info?.isLastChild,
        isNode: info?.isNode,
      });
    }

    entry.children.forEach((child, i) =>
      _flatten(
        child,
        buffer,
        info
          ? {
              depth: info.depth + 2,
              isLastChild: i === entry.children.length - 1,
              isNode: isNode(child),
            }
          : undefined
      )
    );
  } else {
    buffer.push({
      timestamp: entry.timestamp,
      identifier: entry.identifier,
      data: entry.data,
      depth: info ? info.depth : undefined,
      isLastChild: info ? info.isLastChild : undefined,
      isNode: info?.isNode,
    });
  }
}

function isNode(item: LogItem): item is LogNode {
  return "parent" in item || item === state.root;
}

function isRoot(item: LogItem) {
  return item === state.root;
}

export const defaultStringifyOptions: StringifyOptions = {
  showTimestamp: true,
  useColor: true,
  stringProviderMethodName: "toLogInfo",
};

export function render(options: StringifyOptions = defaultStringifyOptions) {
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
        {
          ...options,
          isLastChild: entry.isLastChild!,
        }
      )
    );
  });

  return buffer.join("\n");
}

export function setEnabled(isEnabled: boolean) {
  state.isEnabled = isEnabled;
}

export function clear() {
  state.root = state.head = {
    timestamp: new Date(),
    identifier: RootIdentifier,
    children: [],
  };
}

export function toArray() {
  const buffer: LogEntry[] = [];
  state.root.children.forEach((child) => _toArray(child, buffer));
  return buffer;
}

function _toArray(logItem: LogItem, buffer: LogEntry[]) {
  const entry: LogEntry = {
    timestamp: logItem.timestamp,
    identifier: logItem.identifier,
    data: isNode(logItem) ? undefined : logItem.data,
  };
  buffer.push(entry);
  if (isNode(logItem)) {
    const childBuffer: LogEntry[] = [];
    entry.children = childBuffer;
    logItem.children.forEach((child) => _toArray(child, childBuffer));
  }
}

export function root() {
  return state.root;
}
