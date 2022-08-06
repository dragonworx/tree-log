import {
  Arguments,
  LogDetail,
  LogEntry,
  LogOptions,
  LogTraceDetail,
} from './constTypes';

import { color, decodeColorForLine } from './color';

// alt code references: https://en.wikipedia.org/wiki/Alt_code

export function dataToString(data: Arguments, options: LogOptions): string {
  const { stringProviderMethodName } = options;

  return data
    .map((value) => {
      const type = typeof value;
      if (type === 'string') {
        return color(`"${value}"`, 'orange');
      } else if (type === 'number') {
        return color(value, 'green');
      } else if (type === 'boolean') {
        return color(value, 'magenta');
      } else if (value === null) {
        return color('null', 'red');
      } else if (value === undefined) {
        return color('undefined', 'red');
      } else if (type === 'object') {
        const proto = value.__proto__.constructor.name;
        if (proto === 'Array') {
          return (
            color('[ ', 'white') +
            dataToString(value, options) +
            color(' ]', 'white')
          );
        } else if (proto === 'Date') {
          return color(`${formatDate(value)} ${formatTime(value)}`, 'cyan', {
            bold: true,
          });
        } else if (proto === 'RegExp') {
          const regex = value as RegExp;
          return color(`/${regex.source}/${regex.flags}`, 'cyan', {
            bold: true,
          });
        } else {
          return color(
            stringProviderMethodName! in value
              ? dataToString([value[stringProviderMethodName!]()], options)
              : color('{ ', 'white') +
                  Object.keys(value)
                    .map(
                      (key) =>
                        `${color(key, 'white')}: ${dataToString(
                          [value[key]],
                          options,
                        )}`,
                    )
                    .join(color(', ', 'white')) +
                  color(' }', 'white'),
            'cyan',
            { bold: true },
          );
        }
      }
      return value;
    })
    .join(color(', ', 'grey'));
}

const indentStem = '\u2502'; // │
const nthStem = '\u251C\u2500'; // ├─
const lastStem = '\u2514\u2500'; // └─
const space = ' ';

export function entryToString(
  entry: LogEntry,
  previousDetail: LogDetail,
  info: LogTraceDetail,
  options: LogOptions,
  isLastChild = true,
) {
  const { showTimeStamp, useTimeDelta } = options;

  const { label, data } = entry;

  const prefix = showTimeStamp
    ? `${formatTimeStamp(entry, previousDetail, useTimeDelta!)}${space}`
    : '';
  const indent = color(
    `${indentStem}${space}`.repeat(info.depth) +
      (isLastChild ? lastStem : nthStem),
    'grey',
  );
  const id = info.isNode
    ? color(`${label}:`, 'white', { bold: true, underline: true })
    : color(`${label}:`, 'yellow');
  const dataStr =
    data && data.length > 0 ? space + dataToString(data, options) : '';

  return decodeColorForLine(`${prefix}${indent}${id}${dataStr}`);
}

export function formatTimeStamp(
  entry: LogEntry,
  previousDetail: LogDetail,
  useTimeDelta: boolean,
) {
  const { timestamp } = entry;

  if (useTimeDelta) {
    const previousTimestamp = previousDetail.timestamp;
    const delta = String(
      timestamp.getTime() - previousTimestamp.getTime(),
    ).padStart(6, '0');

    return `+${color(delta, 'cyan', { bold: true })}${color(
      indentStem,
      'cyan',
      {
        bold: true,
      },
    )}`;
  } else {
    const dateStr = formatDate(timestamp);
    const timeStr = formatTime(timestamp);

    return `${color(dateStr + indentStem, 'blue')}${color(
      timeStr + indentStem,
      'cyan',
      {
        bold: true,
      },
    )}`;
  }
}

export function formatDate(date: Date) {
  return `${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}/${date.getDate()}/${date.getFullYear()}`;
}

const pad = (num: number, digits: number) => String(num).padStart(digits, '0');

export function formatTime(date: Date) {
  const hours = pad(date.getHours(), 2);
  const mins = pad(date.getMinutes(), 2);
  const secs = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);

  return `${hours}:${mins}:${secs}:${ms}`;
}
