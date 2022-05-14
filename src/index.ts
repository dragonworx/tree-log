import {
  LogNode,
  LogEntry,
  StringifyOptions,
  State,
  LogItem,
  LogDetail,
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

export const defaultStringifyOptions: StringifyOptions = {
  showTimestamp: true,
  useColor: true,
  stringProviderMethodName: "toLogInfo",
};

export function render(options: StringifyOptions = defaultStringifyOptions) {
  return _render(state.root, state.root, -1, [], options);
}

function _render(
  entry: LogNode = state.root,
  previousDetail: LogDetail,
  depth: number,
  buffer: string[],
  options: StringifyOptions = defaultStringifyOptions
) {
  if (entry !== state.root) {
    buffer.push(entryToString(entry, previousDetail, depth, options));
  }

  entry.children.forEach((item, i) => {
    if ("parent" in item) {
      _render(item, entry, depth + 2, buffer, options);
    } else {
      buffer.push(
        entryToString(item, entry, depth + 1, {
          ...options,
          isLastChild: i === entry.children.length - 1,
        })
      );
    }
  });

  return buffer.join("\n");
}

export function enableLogging(isEnabled: boolean) {
  state.isEnabled = isEnabled;
}

export function clear() {
  state.root = state.head = {
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

export function root() {
  return state.root;
}
