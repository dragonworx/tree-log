import { LogEntry, StringifyOptions, State } from "./types";
import { entryToString } from "./util";

const RootIdentifier = "__ROOT__";

let id = 0;
const nextId = () => ++id;

const state: State = (() => {
  const entry: LogEntry = {
    id,
    timestamp: new Date(),
    identifier: RootIdentifier,
    children: [],
  };
  return {
    isEnabled: true,
    root: entry,
    head: entry,
  };
})();

export function log(identifier: string, ...args: any[]) {
  if (!state.isEnabled) {
    return;
  }

  const entry: LogEntry = {
    id: nextId(),
    timestamp: new Date(),
    identifier,
    args,
    children: [],
  };

  state.head.children.push(entry);
  entry.parent = state.head;
}

export function push(identifier: string, ...args: any[]) {
  if (!state.isEnabled) {
    return;
  }

  const parent = state.head.children.length
    ? state.head.children[state.head.children.length - 1]
    : state.head;

  const entry: LogEntry = {
    id: nextId(),
    timestamp: new Date(),
    identifier,
    args,
    parent,
    children: [],
  };

  parent.children.push(entry);
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

export const defaultStringifyOptions: StringifyOptions = {
  showTimestamp: true,
  useColor: true,
  stringProviderMethodName: "toLogInfo",
};

export function stringify(options: StringifyOptions = defaultStringifyOptions) {
  return _stringify(options, state.root, 0, []);
}

function _stringify(
  options: StringifyOptions = defaultStringifyOptions,
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

/**
 * Toggle whether logging is enabled.
 * Disabled logging is a no-op and will not retain any data or produce any results for stringify()
 * @param isEnabled
 */
export function setIsLoggingEnabled(isEnabled: boolean) {
  state.isEnabled = isEnabled;
}

export function clear() {
  id = 0;
  state.root = state.head = {
    id,
    timestamp: new Date(),
    identifier: RootIdentifier,
    children: [],
  };
}

export function toJSON(space: number = 4) {
  return JSON.stringify(
    state.root,
    (key, value) => (key === "parent" ? undefined : value),
    space
  );
}
