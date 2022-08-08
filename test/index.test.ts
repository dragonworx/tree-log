import {
  setLogOptions,
  clearLog,
  log,
  pushLog,
  popLog,
  snapshotLog,
  printLog,
} from '../src/log';
import { LogEntry, state } from '../src/constTypes';

setLogOptions({ enabled: true });

describe('Tree Log', () => {
  beforeEach(() => {
    clearLog();
  });

  describe('Logging', () => {
    const args = [1, 'two', true];

    const setup = () => {
      log('some-identifier', ...args);
      const children = state.root.children;
      const entry = children[0] as LogEntry;
      return { children, entry };
    };

    it('should capture identifier', () => {
      const { children, entry } = setup();
      expect(children).toHaveLength(1);
      expect(entry.label).toBe('some-identifier');
    });

    it('should capture data', () => {
      const { entry } = setup();
      expect(entry.data).toEqual(args);
    });

    it('should capture timestamp', () => {
      const { entry } = setup();
      expect(entry.timestamp).toBeInstanceOf(Date);
    });

    it('should handle circular references in objects', () => {
      const { children, entry } = setup();
      const a: any = {};
      const b = { a: a };
      a.b = b;
      log('round and round we go', a, b);
      const output = printLog({ silent: true });
      expect(output).toContain('{Circular...}');
    });
  });

  it.skip('should render example', (done) => {
    setLogOptions({
      enabled: true,
      showTimeStamp: false,
      useTimeDelta: true,
      useColor: true,
    });

    async function main() {
      log('start');
      await sub2Func();
      log('end');
    }

    async function sub2Func() {
      pushLog('sub2'); // <- push a new head onto the stack
      log('thing 1', 1, /a/g, new Date(0)); // <- subsequent log calls are now nested
      await sub3Func();
      log('thing 2', 4, { x: 1 });
      popLog(); // <-- when we're done with this level we pop
    }

    function sub3Func() {
      return new Promise((resolve) => {
        setTimeout(() => {
          pushLog('sub3');
          log('thing a', 3, false, ['a', 'b', true]);
          log('thing b', 3, true);
          popLog();
          resolve(void 0);
        }, 1000);
      });
    }

    main().then(() => {
      console.clear();

      setLogOptions({
        useColor: false,
        showTimeStamp: true,
        useTimeDelta: false,
      });

      printLog();
      done();
    });
  });

  it('should match snapshot for output', (done) => {
    log('1');
    pushLog('2');
    log('2.1', 1, /a/g, new Date('01/1/1970 0:00:0:0'));
    pushLog('3');
    log('3.1', 3, false, ['a', 'b', true]);
    log('3.2', 3, true);
    popLog();
    log('2.2', 4, { x: 1 });
    popLog();

    setTimeout(() => {
      log('1.1', 4, null, undefined);
      pushLog('2');
      log('2.1', 6, {
        toLogInfo() {
          return { x: 1, y: 2, w: { z: [1, 2, true] } };
        },
      });

      setTimeout(() => {
        popLog();
        log('1.3', 6);

        setLogOptions({
          useColor: true,
          showTimeStamp: true,
          useTimeDelta: false,
        });

        printLog();

        expect(snapshotLog()).toMatchSnapshot();

        done();
      }, 1000);
    }, 500);
  });
});
