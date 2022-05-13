import { LogEntry, StringifyOptions, State } from "./types";
import { entryToString } from "./util";

const state: State = (() => {
  const entry: LogEntry = {
    timestamp: new Date(),
    children: [],
  };
  return {
    isEnabled: true,
    root: entry,
    head: entry,
  };
})();

export function setEnabled(isEnabled: boolean) {
  state.isEnabled = isEnabled;
}

export function clear() {
  state.root = state.head = {
    timestamp: new Date(),
    children: [],
  };
}

export function push(...data: any[]) {
  if (!state.isEnabled) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date(),
    data,
    children: [],
  };

  state.head.children.push(entry);
  entry.parent = state.head;
  state.head = entry;
}

export function pop() {
  if (!state.isEnabled) {
    return;
  }

  if (state.head.parent) {
    state.head = state.head.parent;
  }
}

export function log(...data: any[]) {
  if (!state.isEnabled) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date(),
    data,
    children: [],
  };

  state.head.children.push(entry);
  entry.parent = state.head;
}

const defaultOptions: StringifyOptions = {
  indentChar: ".",
  showTimestamp: true,
};

export function stringify(options: StringifyOptions = defaultOptions) {
  return _stringify(options, state.root, 0, []);
}

function _stringify(
  options: StringifyOptions = defaultOptions,
  entry: LogEntry = state.root,
  depth: number,
  buffer: string[]
) {
  if (entry !== state.root) {
    buffer.push(entryToString(entry, depth, options));
  }
  entry.children.forEach((childEntry) =>
    _stringify(
      options,
      childEntry,
      depth + (childEntry.children.length ? 2 : 1),
      buffer
    )
  );
  return buffer.join("\n");
}
