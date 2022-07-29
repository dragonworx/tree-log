# Tree Log

![example workflow](https://github.com/dragonworx/tree-log/actions/workflows/build.yml/badge.svg)

Simple but powerful nested logging for debugging and testing.

Works in both the **Browser** and **Node**.

### Logging & Nesting

Logging is broken down into individual log entries. Each entry consists of a string identifier, followed by any arbitrary values using the `log(identifier: string, ...data: any[])` function.

The identifier should provide meaningful context to the point of the log statement and it's recommended to use a dot syntax to create domain context. The arbitrary values become the data of that log entry.

```javascript
import { log } from "turbo-log";

log("some-identifier", value1, value2, value3);
```

Log entries can be nested by increasing or decreasing indentation via `pushLog(identifier: string)` or `popLog()`. This creates a stack-like mechanism.

```javascript
import { log, pushLog, popLog } from "turbo-log";

log("1");
pushLog("2");
log("2.1", 1, /a/g, new Date(0));
pushLog("3");
log("3.1", 3, false, ["a", "b", true]);
log("3.2", 3, true);
popLog();
log("2.2", 4, { x: 1 });
popLog();
```

### Rendering Log Output

For output to console or terminal, use `renderLog(options?: RenderOptions): string` to return a string.

```javascript
import { renderLog } from "turbo-log";

console.log(renderLog());
```

![Example Output](./doc/output1.png)

The following options can be passed to `renderLog()` via the `RenderOptions` object with these optional properties.

- `showTimeStamp: boolean` - Show the timestamp prefix for each line (defaultst to `true`)
- `useTimeDelta: boolean` - Use the milliseconds delta since the last entry, or use the full date and time (defaults to `false`)
- `useColor: boolean` - Output using ansi color codes, or just plain text (defaults to `true`)
- `stringProviderMethodName: string` - When converting argument objects to strings this method will be attempted to call, falling back to native string conversion for that type. This makes objects "log aware" if needed (defaults to `toLogInfo`)

### Enabling/Disabling Logging

Logging can be disabled for production scenarios via the `setEnabled()` function. Logging is disabled by default and must be enabled for development.

```javascript
import { setLogEnabled } from "tree-log";

setLogEnabled(!!process.env.LOGGING);
```

Disabled logging means there is no data collected in memory and adds zero performance overheads as the logging functions are skipped. This allows logging code to remain in the application, and be turned on when testing or debugging during development. This makes logging more of a first class diagnostics tool within the application.

Apart from environment variables set during build, it would also be possible for web applications to use localStorage, query parameters, or a hash value to enable logging dynamically. This would allow debugging in production without impacting default use cases. As with any logging, it's up to you to ensure you do not leak sensitive data while logging.

## Use Cases

This library is lightweight and can be used a general purpose logging tool. Logging is retained in memory and be serialised when needed. Being able to nest statements creates a great tool for diagnostics, troublshooting, performance tuning, and application state changes. Logging statements can be left in production code while turning off any overhead with `

Since the log can be serialised with or without a timestamp, or color, it can be used as a snapshot for integration testing (eg. using Jest text snapshots). Having your application log during testing and then comparing that serialised log to the previous snapshotted serialised log will uncover any changes in determinism, order of events, race conditions, or over calling.
