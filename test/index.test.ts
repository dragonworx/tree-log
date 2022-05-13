import { push, pop, log, stringify, setEnabled } from "../src";

// setEnabled(false);

describe("Log", () => {
  it("should", () => {
    log(0);
    push("foobar:", 1);
    log(1);
    push("two:");
    log(3);
    log(3);
    pop();
    log(4);
    log(4);
    push(5);
    log(6);
    log(6);

    console.log(
      stringify({
        showTimestamp: true,
      })
    );

    expect(true).toBeTruthy();
  });
});
