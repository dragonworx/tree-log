# Tree Log

![example workflow](https://github.com/dragonworx/tree-log/actions/workflows/build.yml/badge.svg)

Simple but powerful nested logging for debugging and testing.

Works in both the **Browser** and **Node**.

### Logging & Nesting

Pass arbitrary arguments to the `log(...)` function.

Log entries can be nested by increasing or decreasing indentation via `push()` or `pop()`. The `push(...)` function also takes arbirtary arguments the same as `log()`. This creates a stack-like mechanism.

```javascript
import { log, push, pop } from 'tree-log`;

log("foo");
push("foo.bar", 1);
log(1, /a/g, new Date());
push("baz");
log(3, false, ["a", "b", true]);
log(3, true);
pop();
log(4, { x: 1 });
log(4);
push(5, null, undefined);
log(6, {
  asInfo() {
    return { x: 1, y: 2, w: { z: [1, 2, true] } };
  },
});
log(6);
```

### Serialising Log Output

Use `renderLog(options?: StringifyOptions): string` to create a string output, passing any required options.

```javascript
import { renderLog } from "turbo-log";

console.log(
  renderLog({
    showTimeStamp: true,
    useColor: true,
  })
);
```

![Example Output](./doc/output1.png)

The following options can be passed to `renderLog()` via a `RenderOptions` object with these optional properties.

- `showTimeStamp: boolean` - Show the timestamp prefix for each line (defaultst to `true`)
- `useTimeDelta: boolean` - Use the milliseconds delta since the last entry, or use the full date and time (defaults to `false`)
- `useColor: boolean` - Output using ansi color codes, or just plain text (defaults to `true`)
- `stringProviderMethodName: string` - When converting argument objects to strings this method will be attempted to call, falling back to native string conversion for that type. This makes objects "log aware" if needed (defaults to `toLogInfo`)

### Enabling/Disabling Logging

Logging can be disabled for production scenarios via the `setEnabled()` function.

```javascript
import { setLogEnabled } from "tree-log";

setLogEnabled(!!process.env.LOGGING);
```

Disabled logging means there is no data collected in memory and adds zero performance overheads as the logging functions are skipped. This allows logging code to remain in the application, and be turned on when testing or debugging during development. This makes logging more of a first class diagnostics tool within the application.

## Use Cases

This library is lightweight and can be used a general purpose logging tool. Logging is retained in memory and be serialised when needed. Being able to nest statements creates a great tool for diagnostics, troublshooting, performance tuning, and application state changes. Logging statements can be left in production code while turning off any overhead with `

Since the log can be serialised with or without a timestamp, or color, it can be used as a snapshot for integration testing (eg. using Jest text snapshots). Having your application log during testing and then comparing that serialised log to the previous snapshotted serialised log will uncover any changes in determinism, order of events, race conditions, or over calling.
