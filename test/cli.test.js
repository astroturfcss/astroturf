import fs from 'fs/promises';

import { handler } from '../src/cli';

async function copyFixture(file) {
  const dest = `${__dirname}/output/${file}`;
  await fs.copyFile(`${__dirname}/fixtures/${file}`, dest);
  return dest;
}

async function run(fixture, outFile = true) {
  await handler({
    files: [await copyFixture(fixture)],
    outFile: outFile ? `${__dirname}/output/out.css` : undefined,
  });

  const output = await fs.readdir(`${__dirname}/output`);

  return Promise.all(
    output.map(async (file) => {
      const content = await fs.readFile(
        `${__dirname}/output/${file}`,
        'utf-8',
      );
      await fs.unlink(`${__dirname}/output/${file}`);
      return { name: file, content };
    }),
  );
}

describe('cli', () => {
  it('should work with out file', async () => {
    const output = await run('typescript.tsx');

    for (const out of output) {
      if (out.name.endsWith('.tsx')) {
        expect(out.content).not.toContain('.css');
      }
      expect(out.content).toMatchFile(
        `${__dirname}/__file_snapshots__/cli__out_file__${out.name}`,
      );
    }
  });

  it('should work with out file', async () => {
    const output = await run('typescript.tsx', false);

    for (const out of output) {
      if (out.name.endsWith('.tsx')) {
        expect(out.content).toContain('.css');
      }
      expect(out.content).toMatchFile(
        `${__dirname}/__file_snapshots__/cli__no-out-file__${out.name}`,
      );
    }
  });

  it('does not export output empty css', async () => {
    const output = await run('empty-css.js', false);

    expect(output).toHaveLength(1);
    expect(output[0].content).toMatchInlineSnapshot(`
      "
      const _styles = {};




      const styles = _styles"
    `);
  });

  it('should export icss exports and values', async () => {
    const output = await run('icss-export.js', false);

    expect(output).toHaveLength(1);
    expect(output[0].content).toMatchInlineSnapshot(`
      "
      const _styles = {
        \\"@quz\\": \\"baz\\",
        \\"foo\\": \\"bar\\",
        \\"baz\\": \\"1px\\"
      };




      const styles = _styles"
    `);
  });
});
