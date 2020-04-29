import { stripIndents } from 'common-tags';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import diff from 'jest-diff';
import { toMatchFile } from 'jest-file-snapshot';

expect.extend({
  toMatchFile,

  toIgnoreIndentAndContain(received, expected) {
    const a = stripIndents([received]);
    const b = stripIndents([expected]);

    const pass = a.includes(b);

    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const message = pass
      ? () =>
          `${this.utils.matcherHint(
            'toIgnoreIndentAndContain',
            undefined,
            undefined,
            options,
          )}\n\n` +
          `Expected substring: not\n${this.utils.printExpected(b)}\n` +
          `\nReceived:\n${this.utils.printReceived(a)}`
      : () => {
          const diffString = diff(a, b, {
            expand: this.expand,
          });
          return `${this.utils.matcherHint(
            'toIgnoreIndentAndContain',
            undefined,
            undefined,
            options,
          )}\n\n${
            diffString && diffString.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}`
          }`;
        };

    return { actual: received, message, pass };
  },
});
Enzyme.configure({ adapter: new Adapter() });

jest.mock('../src/utils/getLoaderPrefix', () => () =>
  'astroturf/css-loader?inline!',
);

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = true;
