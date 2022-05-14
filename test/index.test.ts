import {
  push,
  pop,
  log,
  stringify,
  clear,
  setIsLoggingEnabled,
  toJSON,
} from "../src";

setIsLoggingEnabled(true);

describe("Tree Log", () => {
  it("should log passed arguments", () => {
    log("foo");
    push("bar", 1);
    log("baz", 1, /a/g, new Date());
    push("bez");
    log("efg", 3, false, ["a", "b", true]);
    log("abc", 3, true);
    pop();
    log("xyz", 4, { x: 1 });
    log("xyz", 4);
    push("xyz", 5, null, undefined);
    log("xyz", 6, {
      toLogInfo() {
        return { x: 1, y: 2, w: { z: [1, 2, true] } };
      },
    });
    log("xyz", 6);
    // console.log(stringify());
    console.log(toJSON());
  });
});

/**
 * │
 * ├
 * ─
 * └
 */
