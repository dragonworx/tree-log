import { LogEntry, StringifyOptions } from "./types";

export const chars = {
  stemLeaf: "├",
  steamBranch: "│",
  branch: "─",
};

export const defaultStringifyOptions: StringifyOptions = {
  indentChar: ".",
  showTimestamp: true,
};

export function dataToString(
  entry: LogEntry,
  depth: number,
  options: StringifyOptions
) {
  const { indentChar, showTimestamp } = {
    ...defaultStringifyOptions,
    ...options,
  };
  const indent = indentChar ? indentChar.repeat(Math.max(0, depth - 1)) : "";
  let data = String(entry.data);
  try {
    data = entry.data
      ? JSON.stringify(entry.data)
          .replace(/^\[|\]$/g, "")
          .replace(/,/g, ", ")
      : "";
  } catch (e) {}
  const prefix = `${formatDate(entry.timestamp)} `;
  return `${showTimestamp ? prefix : ""}${indent}${data}`;
}

export function formatDate(date: Date) {
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
