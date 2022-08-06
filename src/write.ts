import {
  LogEntry,
  LogItem,
  LogNode,
  LogTrace,
  LogTraceDetail,
  state,
} from './constTypes';

export function flatten(withDetail = false) {
  const buffer: Array<LogTrace> = [];
  _flatten(
    state.root,
    buffer,
    withDetail ? { depth: -2, isLastChild: false, isNode: true } : undefined,
  );
  return buffer;
}

function _flatten(
  entry: LogEntry,
  buffer: Array<LogTrace>,
  info?: LogTraceDetail,
) {
  if (isNode(entry)) {
    if (!isRoot(entry)) {
      buffer.push({
        timestamp: entry.timestamp,
        label: entry.label,
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
          : undefined,
      ),
    );
  } else {
    buffer.push({
      timestamp: entry.timestamp,
      label: entry.label,
      data: entry.data,
      depth: info ? info.depth : undefined,
      isLastChild: info ? info.isLastChild : undefined,
      isNode: info?.isNode,
    });
  }
}

function isNode(item: LogItem): item is LogNode {
  return 'parent' in item || item === state.root;
}

function isRoot(item: LogItem) {
  return item === state.root;
}

export function toArray() {
  const buffer: LogEntry[] = [];
  state.root.children.forEach((child) => _toArray(child, buffer));
  return buffer;
}

function _toArray(logItem: LogItem, buffer: LogEntry[]) {
  const entry: LogEntry = {
    timestamp: logItem.timestamp,
    label: logItem.label,
    data: isNode(logItem) ? undefined : logItem.data,
  };
  buffer.push(entry);
  if (isNode(logItem)) {
    const childBuffer: LogEntry[] = [];
    entry.children = childBuffer;
    logItem.children.forEach((child) => _toArray(child, childBuffer));
  }
}
