import { defaultRenderOptions } from ".";
import {
  Arguments,
  LogDetail,
  LogEntry,
  LogTraceDetail,
  RenderOptions,
} from "./types";

const clr = require("ansi-colors");

// alt code references: https://en.wikipedia.org/wiki/Alt_code

export function dataToString(data: Arguments, options: RenderOptions): string {
  const { stringProviderMethodName } = {
    ...defaultRenderOptions,
    ...options,
  };

  return data
    .map((value) => {
      const type = typeof value;
      if (type === "string") {
        return clr.white(`"${value}"`);
      } else if (type === "number") {
        return clr.green(value);
      } else if (type === "boolean") {
        return clr.magenta(value);
      } else if (value === null) {
        return clr.red("null");
      } else if (value === undefined) {
        return clr.red("undefined");
      } else if (type === "object") {
        const proto = value.__proto__.constructor.name;
        if (proto === "Array") {
          return "[" + dataToString(value, options) + "]";
        } else if (proto === "Date") {
          return clr.cyanBright(`${formatDate(value)} ${formatTime(value)}`);
        } else if (proto === "RegExp") {
          const regex = value as RegExp;
          return clr.cyanBright(`/${regex.source}/${regex.flags}`);
        } else {
          return clr.cyanBright(
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
    .join(clr.grey(", "));
}

export function entryToString(
  entry: LogEntry,
  previousDetail: LogDetail,
  info: LogTraceDetail,
  options: RenderOptions & { isLastChild: boolean } = { isLastChild: true }
) {
  const {
    showTimeStamp: showTimestamp,
    isLastChild,
    useColor,
    useTimeDelta,
  } = {
    ...defaultRenderOptions,
    ...options,
  };

  clr.enabled = !!useColor;

  const { identifier, data } = entry;

  const prefix = showTimestamp
    ? `${formatTimeStamp(entry, previousDetail, useTimeDelta!)} `
    : "";
  const indent = clr.grey(`│ `.repeat(info.depth) + (isLastChild ? "└" : "├"));
  const id = info.isNode
    ? clr.bold.white.underline(`${identifier} `)
    : clr.bold.yellow(`${identifier} `);
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
    const delta = String(
      timestamp.getTime() - previousTimestamp.getTime()
    ).padStart(6, "0");

    return `+${clr.cyanBright(delta)}${clr.cyanBright("│")}`;
  } else {
    const dateStr = formatDate(timestamp);
    const timeStr = formatTime(timestamp);

    return `${clr.blue(dateStr + "│")}${clr.cyanBright(timeStr + "│")}`;
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
