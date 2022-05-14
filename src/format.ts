import { defaultStringifyOptions } from ".";
import { Arguments, LogDetail, LogEntry, StringifyOptions } from "./types";
const c = require("ansi-colors");

// https://en.wikipedia.org/wiki/Alt_code

export function dataToString(
  data: Arguments,
  options: StringifyOptions
): string {
  const { stringProviderMethodName } = {
    ...defaultStringifyOptions,
    ...options,
  };

  return data
    .map((value) => {
      const type = typeof value;
      if (type === "string") {
        return c.white(`"${value}"`);
      } else if (type === "number") {
        return c.green(value);
      } else if (type === "boolean") {
        return c.magenta(value);
      } else if (value === null) {
        return c.red("null");
      } else if (value === undefined) {
        return c.red("undefined");
      } else if (type === "object") {
        const proto = value.__proto__.constructor.name;
        if (proto === "Array") {
          return "[" + dataToString(value, options) + "]";
        } else if (proto === "Date") {
          return c.cyanBright(`${formatDate(value)} ${formatTime(value)}`);
        } else if (proto === "RegExp") {
          const regex = value as RegExp;
          return c.cyanBright(`/${regex.source}/${regex.flags}`);
        } else {
          return c.cyanBright(
            stringProviderMethodName! in value
              ? dataToString([value[stringProviderMethodName!]()], options)
              : "{ " +
                  Object.keys(value)
                    .map(
                      (key) => `${key}: ${dataToString([value[key]], options)}`
                    )
                    .join(", ") +
                  " }"
          );
        }
      }
      return value;
    })
    .join(c.grey(", "));
}

export function entryToString(
  entry: LogEntry,
  previousDetail: LogDetail,
  depth: number,
  options: StringifyOptions = {}
) {
  const { showTimestamp, isLastChild, useColor, useTimeDelta } = {
    ...defaultStringifyOptions,
    ...options,
  };

  c.enabled = !!useColor;

  const { identifier, data } = entry;

  const prefix = showTimestamp
    ? `${formatTimeStamp(entry, previousDetail, useTimeDelta!)} `
    : "";
  const indent = c.grey(`│ `.repeat(depth) + (isLastChild ? "└" : "├"));
  const id = c.bold.yellow(`${identifier} `);
  const dataStr = data ? dataToString(data, options) : "";

  return `${prefix}${indent}${id}${dataStr}`;
}

export function formatTimeStamp(
  entry: LogEntry,
  previousDetail: LogDetail,
  useTimeDelta: boolean
) {
  const { timestamp } = entry;

  if (useTimeDelta) {
    const previousTimestamp = previousDetail.timestamp;
    const delta = timestamp.getTime() - previousTimestamp.getTime();

    return `+${c.cyanBright(delta)}`;
  } else {
    const dateStr = formatDate(timestamp);
    const timeStr = formatTime(timestamp);

    return `${c.blue(dateStr + "│")}${c.cyanBright(timeStr + "│")}`;
  }
}

export function formatDate(date: Date) {
  return `${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${date.getDate()}/${date.getFullYear()}`;
}

export function formatTime(date: Date) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();
  const ms = date.getMilliseconds();
  const minutes = mins < 10 ? "0" + mins : mins;

  return `${hours}:${minutes}:${secs}:${ms}`;
}
