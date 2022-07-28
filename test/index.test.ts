import {
  setEnabled,
  clear,
  log,
  push,
  pop,
  render,
  toArray,
  flatten,
  root,
} from "../src";
import { LogEntry } from "../src/types";

setEnabled(true);

describe("Tree Log", () => {
  beforeEach(() => {
    clear();
  });

  describe("Logging", () => {
    const args = [1, "two", true];

    const setup = () => {
      log("some-identifier", ...args);
      const children = root().children;
      const entry = children[0] as LogEntry;
      return { children, entry };
    };

    it("should capture identifier", () => {
      const { children, entry } = setup();
      expect(children).toHaveLength(1);
      expect(entry.identifier).toBe("some-identifier");
    });

    it("should capture data", () => {
      const { entry } = setup();
      expect(entry.data).toEqual(args);
    });

    it("should capture timestamp", () => {
      const { entry } = setup();
      expect(entry.timestamp).toBeInstanceOf(Date);
    });
  });

  it("should match snapshot", (done) => {
    log("1");
    push("2");
    log("2.1", 1, /a/g, new Date(1659007228539));
    push("3");
    log("3.1", 3, false, ["a", "b", true]);
    log("3.2", 3, true);
    pop();
    log("2.2", 4, { x: 1 });
    pop();

    setTimeout(() => {
      log("1.1", 4, null, undefined);
      push("2");
      log("2.1", 6, {
        toLogInfo() {
          return { x: 1, y: 2, w: { z: [1, 2, true] } };
        },
      });

      setTimeout(() => {
        pop();
        log("1.3", 6);

        const outputSnapshot = render({
          useColor: false,
          showTimestamp: false,
        });

        const outputFull = render({
          useColor: false,
          showTimestamp: false,
        });

        console.log(outputFull);
        console.log(JSON.stringify(toArray(), null, 4));
        console.log(JSON.stringify(flatten(false), null, 4));
        expect(outputSnapshot).toMatchSnapshot();
        done();
      }, 1000);
    }, 500);
  });
});
