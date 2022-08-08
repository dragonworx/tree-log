import {
  LogNode,
  LogEntry,
  state,
  LogOptions,
  isBrowser,
  RootLabel,
} from './constTypes';
import { entryToString } from './format';
import { flatten } from './write';
import { decodeBrowserColorLine } from './color';

const warn = () => {
  if (!state.hasWarned) {
    console.log(
      '%cturbo-log%c is disabled.',
      'color:cyan;font-weight:bold;',
      'color:grey',
    );
    state.hasWarned = true;
  }
};

export function log(label: string, ...data: any[]) {
  if (!state.options.enabled) {
    return warn();
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
    return warn();
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
    return warn();
  }

  if (state.head.parent) {
    state.head = state.head.parent;
  }
}

export function renderBuffer(options: Partial<LogOptions> = {}) {
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
          ...state.options,
          ...options,
        },
        entry.isLastChild,
      ),
    );
  });

  return buffer;
}

export function snapshotLog() {
  const buffer = renderBuffer({ useColor: false, showTimeStamp: false });
  return buffer.join('\n');
}

export function printLog(
  options: Partial<LogOptions & { silent?: boolean }> = {},
) {
  const buffer = renderBuffer(options);
  if (!isBrowser || state.options.useColor === false) {
    const output = buffer.join('\n');
    if (options.silent !== true) {
      console.log(output);
    }
    return output;
  } else {
    const allMessages: string[] = [];
    const allStyles: string[][] = [];
    buffer.forEach((line) => {
      const [message, style] = decodeBrowserColorLine(line);
      allMessages.push(message);
      if (style) {
        allStyles.push(style);
      }
    });
    const output = allMessages.join('\n');
    if (options.silent !== true) {
      console.log(output, ...allStyles.flat());
    }
    return output;
  }
}

export function setLogOptions(options: Partial<LogOptions>) {
  state.options = {
    ...state.options,
    ...options,
  };
  if (options.enabled && state.hasWarned) {
    state.hasWarned = false;
  }
}

export function clearLog() {
  state.root = state.head = {
    timestamp: new Date(),
    label: RootLabel,
    children: [],
  };
}
