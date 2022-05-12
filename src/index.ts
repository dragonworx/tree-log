export interface LogEntry {
  timestamp: Date;
  data?: any[];
  parent?: LogEntry;
  children: LogEntry[];
}

let enabled = true;
let root: LogEntry = newRoot();
let head = root;

function newRoot(): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date(),
    children: [],
  };
  root = head = entry;
  return entry;
}

function dataToString(entry: LogEntry, depth: number, options: Options) {
  const indent = options.indentChar.repeat(Math.max(0, depth - 1));
  let data = String(entry.data);
  try {
    data = entry.data
      ? JSON.stringify(entry.data)
          .replace(/^\[|\]$/g, "")
          .replace(/,/g, ", ")
      : "";
  } catch (e) {}
  const prefix = `${formatDate(entry.timestamp)}:`;
  return `${options.showTimestamp ? prefix : ""}${indent}${data}`;
}

function formatDate(date: Date) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();
  const ms = date.getMilliseconds();
  const minutes = mins < 10 ? "0" + mins : mins;
  const dateStr = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  const timeStr = `${hours}:${minutes}:${secs}:${ms}`;
  return `${dateStr} ${timeStr}`;
}

export function init() {
  return newRoot();
}

export function push(...data: any[]) {
  if (!enabled) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date(),
    data,
    children: [],
  };
  head.children.push(entry);
  entry.parent = head;
  head = entry;
}

export function pop() {
  if (!enabled) {
    return;
  }

  if (head.parent) {
    head = head.parent;
  } else {
    console.warn("Attempt to pop root log entry");
  }
}

export function log(...data: any[]) {
  if (!enabled) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date(),
    data,
    children: [],
  };
  head.children.push(entry);
  entry.parent = head;
}

export type Options = {
  indentChar: string;
  showTimestamp: boolean;
};

const defaultOptions: Options = {
  indentChar: ".",
  showTimestamp: true,
};

export function dump(
  options: Options = defaultOptions,
  entry: LogEntry = root,
  depth: number = 0,
  buffer: string[] = []
) {
  buffer.push(dataToString(entry, depth, options));
  entry.children.forEach((childEntry) =>
    dump(
      options,
      childEntry,
      depth + (childEntry.children.length ? 2 : 1),
      buffer
    )
  );
  return buffer.join("\n");
}

export function getRoot() {
  return root;
}

export function setEnabled(isEnabled: boolean) {
  enabled = isEnabled;
}
