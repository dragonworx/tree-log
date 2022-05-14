import { defaultStringifyOptions } from "./";
import { Arguments, LogEntry, StringifyOptions } from "./types";
const c = require("ansi-colors");

// https://en.wikipedia.org/wiki/Alt_code

export function dataToString(
  data: Arguments,
  options: StringifyOptions
): string {
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
        return c.cyanBright(value);
      } else if (value === null) {
        return c.grey("null");
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
  const { showTimestamp } = {
    ...defaultStringifyOptions,
    ...options,
  };

  const { timestamp, identifier, args } = entry;

  const prefix = showTimestamp
    ? `${formatTimeStamp(timestamp)}${c.bold.blueBright("│")} `
    : "";
  const indent = c.grey(
    `│ `.repeat(Math.max(0, depth - 1)) + entry.parent?.identifier
  );
  const id = c.bold.white(`${identifier}: `);
  const dataStr = args ? dataToString(args, options) : "";

  return `${prefix}${indent}${id}${dataStr}`;
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
