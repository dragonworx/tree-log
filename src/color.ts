import { state, isBrowser, ColorOptions } from './constTypes';

export const ops: Record<string, string> = {
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  underline: '\u001b[4m',
  reversed: '\u001b[7m',
};

export const colors: Record<string, string[]> = {
  black: ['\u001b[30m', 'black'],
  red: ['\u001b[31m', 'red'],
  green: ['\u001b[32m', 'green'],
  yellow: ['\u001b[33m', 'yellow'],
  blue: ['\u001b[34m', '#1950b4'],
  magenta: ['\u001b[35m', 'magenta'],
  cyan: ['\u001b[36m', 'cyan'],
  white: ['\u001b[37m', 'white'],
  //
  grey: ['\u001b[38;5;240m', 'grey'],
  orange: ['\u001b[38;5;220m', 'orange'],
};

export const boldTerminalColors: Record<string, string> = {
  black: '\u001b[30;1m',
  red: '\u001b[31;1m',
  green: '\u001b[32;1m',
  yellow: '\u001b[33;1m',
  blue: '\u001b[34;1m',
  magenta: '\u001b[35;1m',
  cyan: '\u001b[36;1m',
  white: '\u001b[37;1m',
};

const t1 = '\u0001';
const t2 = '\u0002';
const t3 = '\u0003';
const t4 = '\u0004';

export function color(str: string, cname: string, options: ColorOptions = {}) {
  if (!state.options.useColor) {
    return str;
  }
  return `${t2}${cname}+${options.bold ? 1 : 0}+${
    options.underline ? 1 : 0
  }${t3}${str}`;
}

export function decodeColorForLine(str: string) {
  if (!state.options.useColor) {
    return str;
  }
  return str
    .split(t2)
    .map((chunk) => {
      const [cnameInfo, ...contents] = chunk.split('\u0003');
      const str = contents.join('');
      return !isBrowser
        ? terminalColor(str, cnameInfo)
        : browserColor(str, cnameInfo);
    })
    .join('');
}

export function terminalColor(str: string, cnameInfo: string) {
  const [cname, boldFlag, underlineFlag] = cnameInfo.split('+');
  if (cname.length === 0) {
    return str;
  }
  const bold = boldFlag === '1';
  const underline = underlineFlag === '1';
  const setColor = bold ? `${boldTerminalColors[cname]}` : colors[cname][0];
  return `${setColor}${underline ? ops.underline : ''}${str}${ops.reset}`;
}

export function browserColor(str: string, cnameInfo: string) {
  return `${t1}${cnameInfo}${t4}${str}`;
}

export function decodeBrowserColorLine(str: string): [string, string[]] {
  const style: string[] = [];
  const output = str
    .split(t1)
    .map((chunk) => {
      const [cnameInfo, ...message] = chunk.split(t4);
      const [cname, boldFlag, underlineFlag] = cnameInfo.split('+');
      if (cname.length === 0) {
        return message;
      }
      const bold = boldFlag === '1';
      const underline = underlineFlag === '1';
      const colorStyle = `color:${colors[cname][1]};`;
      const boldStyle = bold ? 'text-weight:bold;' : '';
      const underlineStyle = underline ? 'text-decoration:underline;' : '';
      style.push(
        colorStyle + boldStyle + underlineStyle + 'font-family:monospace;',
      );
      return `%c${message}`;
    })
    .join('');
  return [output, style];
}
