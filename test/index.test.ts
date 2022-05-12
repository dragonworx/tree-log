import { push, pop, log, dump, setEnabled } from "../src";

// setEnabled(false);

describe.skip("Log", () => {
  it("should", () => {
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

    console.log(dump());

    expect(true).toBeTruthy();
  });
});
