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

Use `stringify()` to create a string output, passing any required options.

```javascript
console.log(
  stringify({
    showTimestamp: true,
    useColor: true,
  })
);
```

![Example Output](./doc/output1.png)

### Logging Custom Objects

Any objects logged that implement an `asInfo()` function/method can provide a custom representation that will become the log output for that object. The `stringify()` option `stringProviderMethodName` can be used to configure what this function name is, defaults to `asInfo`.

### Enabling/Disabling Logging

Logging can be disabled for production scenarios via the `setEnabled()` function.

```javascript
import { setEnabled } from "tree-log";

setEnabled(!!process.env.LOGGING);
```

Disabled logging does not collect any data in memory and adds neglible to zero performance overheads. This allows logging code to remain in the application, and turned on when testing or debugging during development.

## Use Cases

This library is lightweight and can be used a general purpose logging tool. Logging is retained in memory and be serialised when needed. Being able to nest statements creates a great tool for diagnostics, troublshooting, performance tuning, and application state changes.

Since the log can be serialised with or without a timestamp, or color, it can be used as a snapshot for integration testing (eg. using Jest text snapshots). Having your application log during testing and then comparing that serialised log to the previous snapshotted serialised log will uncover any changes in determinism, order of events, race conditions, or over calling.
