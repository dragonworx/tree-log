import { push, pop, log, stringify, setEnabled } from "../src";

setEnabled(true);

describe("Log", () => {
  it("should", () => {
    log(0);
    push("foobar:", 1);
    log(1, /a/g, new Date());
    push("two:");
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

    console.log(
      stringify({
        showTimestamp: true,
        useColor: true,
      })
    );

    expect(true).toBeTruthy();
  });
});
