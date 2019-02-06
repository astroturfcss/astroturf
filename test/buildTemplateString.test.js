import { stripIndents } from 'common-tags';
import { parse } from '@babel/parser';

import { traverse } from './helpers';
import buildTemplateString from '../src/utils/buildTemplateString';

describe('builtTemplateString', () => {
  const run = code => {
    let tag;
    traverse(parse(code), {
      TaggedTemplateExpression(path) {
        tag = path;
      },
    });
    return tag;
  };

  it('should build string', () => {
    const tag = run(stripIndents`
      const width = 5;
      const prop = 'font-size';

      styled('div')\`
        \${prop}: \${width}px;
      \`;
    `);

    const result = buildTemplateString(tag, 'Foo');

    expect(result.text).toEqual('\nfont-size: 5px;\n');
    expect(result.interpolations).toHaveLength(0);
  });

  it('should return function interpolations', () => {
    const tag = run(stripIndents`
      const width = () => 5;

      styled('div')\`
        font-size: \${width}px;
      \`;
    `);

    const { text, interpolations } = buildTemplateString(tag, 'Foo');

    expect(interpolations).toHaveLength(1);
    expect(interpolations[0].unit).toEqual('px');
    expect(text).toEqual(`\nfont-size: var(--${interpolations[0].id});\n`);
  });

  it('should throw when interpolation is not enabled', () => {
    const tag = run(stripIndents`
      styled('div')\`
        font-size: \${() => 5}px;
      \`;
    `);

    expect(() => {
      buildTemplateString(tag, 'Foo', { allowInterpolation: false });
    }).toThrowError(
      "Functional styled tag interpolations are not enabled. To allow compiling dynamic interpolations to CSS custom properties set the 'allowInterpolations` option to true.",
    );
  });

  it('should throw for function interpolations in css tag', () => {
    const tag = run(stripIndents`
      css\`
        font-size: \${() => 5}px;
      \`;
    `);

    expect(() => {
      buildTemplateString(tag, 'Foo', { allowInterpolation: false });
    }).toThrowError(
      'Functional interpolations are not allowed in css tags, only the styled api supports this.',
    );
  });

  it('should throw none statically determinable values', () => {
    const tag = run(stripIndents`
      css\`
        font-size: \${foo}px;
      \`;
    `);

    expect(() => {
      buildTemplateString(tag, 'Foo');
    }).toThrowError(
      'This css tagged template contains interpolations that cannot be statically evaluated.',
    );
  });
});
