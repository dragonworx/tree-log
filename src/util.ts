import { Data, LogEntry, StringifyOptions } from "./types";
import c from "ansi-colors";

// https://en.wikipedia.org/wiki/Alt_code

export const defaultStringifyOptions: StringifyOptions = {
  indentChar: ".",
  showTimestamp: true,
  useColor: true,
  stringProviderMethodName: "asInfo",
};

export function dataToString(data: Data, options: StringifyOptions): string {
  const { useColor, stringProviderMethodName } = {
    ...defaultStringifyOptions,
    ...options,
  };

  c.enabled = !!useColor;

  return data
    .map((value) => {
      const type = typeof value;
      if (type === "string") {
        return `"${c.yellow(value)}"`;
      } else if (type === "number") {
        return c.green(value);
      } else if (type === "boolean") {
        return c.grey(value);
      } else if (value === null) {
        return c.blueBright("null");
      } else if (value === undefined) {
        return c.red("undefined");
      } else if (type === "object") {
        const proto = value.__proto__.constructor.name;
        if (proto === "Array") {
          return "[" + dataToString(value, options) + "]";
        } else if (proto === "Date") {
          return `${formatDate(value)} ${formatTime(value)}`;
        } else if (proto === "RegExp") {
          const regex = value as RegExp;
          return c.yellow(`/${regex.source}/${regex.flags}`);
        } else {
          return stringProviderMethodName! in value
            ? dataToString([value[stringProviderMethodName!]()], options)
            : "{ " +
                Object.keys(value)
                  .map(
                    (key) => `${key}: ${dataToString([value[key]], options)}`
                  )
                  .join(", ") +
                " }";
        }
      }
      return value;
    })
    .join(c.grey(", "));
}

export function entryToString(
  entry: LogEntry,
  depth: number,
  options: StringifyOptions = {}
) {
  const { indentChar, showTimestamp } = {
    ...defaultStringifyOptions,
    ...options,
  };

  const indent = indentChar
    ? c.grey(indentChar.repeat(Math.max(0, depth - 1)))
    : "";

  const dataStr = entry.data ? dataToString(entry.data, options) : "";

  const prefix = `${formatTimeStamp(entry.timestamp)}│ `;

  return `${showTimestamp ? prefix : ""}${indent}${dataStr}`;
}

export function formatTimeStamp(date: Date) {
  const dateStr = formatDate(date);
  const timeStr = formatTime(date);

  return `${c.blue(dateStr)} ${c.cyanBright(timeStr)}`;
}

export function formatDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function formatTime(date: Date) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();
  const ms = date.getMilliseconds();
  const minutes = mins < 10 ? "0" + mins : mins;

  return `${hours}:${minutes}:${secs}:${ms}`;
}
