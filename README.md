# Tree Log

![example workflow](https://github.com/dragonworx/tree-log/actions/workflows/build.yml/badge.svg)

Simple but powerful nested logging for debugging and testing.

Pass arbitrary arguments to the `log(...)` or `push(...)` function.

Log entries can be nested by increasing or decreasing indentation via `push()` or `pop()`.

```javascript
import { push, pop, log } from 'tree-log`;

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

Any objects logged that implement an `asInfo()` function/method can provide a custom representation that will become the log output for that object. The `stringify()` option `stringProviderMethodName` can be used to configure what this function name is, defaults to `asInfo`.
