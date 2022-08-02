import {
  setLogEnabled,
  clear,
  log,
  pushLog,
  popLog,
  renderLog,
  toArray,
  flatten,
  root,
} from "../src";
import { LogEntry } from "../src/types";

setLogEnabled(true);

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

  it("should match snapshot for output", (done) => {
    log("1");
    pushLog("2");
    log("2.1", 1, /a/g, new Date("01/1/1970 0:00:0:0"));
    pushLog("3");
    log("3.1", 3, false, ["a", "b", true]);
    log("3.2", 3, true);
    popLog();
    log("2.2", 4, { x: 1 });
    popLog();

    setTimeout(() => {
      log("1.1", 4, null, undefined);
      pushLog("2");
      log("2.1", 6, {
        toLogInfo() {
          return { x: 1, y: 2, w: { z: [1, 2, true] } };
        },
      });

      setTimeout(() => {
        popLog();
        log("1.3", 6);

        const outputSnapshot = renderLog({
          useColor: false,
          showTimeStamp: false,
        });

        const outputFull = renderLog({
          useColor: true,
          showTimeStamp: true,
          useTimeDelta: true,
        });

        console.log(outputFull);
        console.log("toArray:", JSON.stringify(toArray(), null, 4));
        console.log("flatten:", JSON.stringify(flatten(true), null, 4));
        expect(outputSnapshot).toMatchSnapshot();
        done();
      }, 1000);
    }, 500);
  });
});
