import { buildLoaderRequest, format, run, runLoader } from './helpers';

describe('import ordering', () => {
  describe('esm', () => {
    const esmCode = `
      import Component from './Foo';
      import styled, { css } from 'astroturf/react';
      import Component2 from './Foo2';

      const styles = css\`
        .blue {
          color: blue;
        }
      \`;

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          >
            <span css="height: 3rem;"/>
          </button>
        );
      }

      const styles2 = css\`
        .blue {
          color: blue;
        }
      \`;

      const P = styled('p')\`
        color: blue;
      \`;

    `;

    it('should inject imports in the right order (babel)', async () => {
      const [code] = await run(esmCode, { enableCssProp: true });

      expect(code).toContain(
        format`
          import _j from "astroturf/jsx";
          import Component from "./Foo";
          import styled from "astroturf/react";
          import Component2 from './Foo2';
          import _styles from "./MyStyleFile-styles.module.css";
          import _CssProp1_button from "./MyStyleFile-CssProp1_button.module.css";
          import _CssProp2_span from "./MyStyleFile-CssProp2_span.module.css";
          import _styles2 from "./MyStyleFile-styles2.module.css";
          import _P from "./MyStyleFile-P.module.css";
        `,
      );
    });

    it('should inject imports in the right order (webpack)', async () => {
      const [code] = await runLoader(esmCode, { enableCssProp: true });

      expect(code).toContain(
        format`
          import _j from "astroturf/jsx";
          import Component from "./Foo";
          import styled from "astroturf/react";
          import Component2 from './Foo2';
          import _styles from "${buildLoaderRequest('styles')}";
          import _CssProp1_button from "${buildLoaderRequest(
            'CssProp1_button',
          )}";
          import _CssProp2_span from "${buildLoaderRequest('CssProp2_span')}";
          import _styles2 from "${buildLoaderRequest('styles2')}";
          import _P from "${buildLoaderRequest('P')}";
        `,
      );
    });
  });

  describe('commonjs', () => {
    /**
     * We don't fully support the CJS case, it really only works with allowGlobal
     * but there isn't a reason why wouldn't in the future for imports
     */
    const cjsCode = `
      const Component = require('./Foo');
      const Component2 = require('./Foo2');

      const styles = css\`
        .blue {
          color: blue;
        }
      \`;

      function Button() {
        return (
          <button
            css={css\`
              color: blue;
            \`}
          >
            <span css="height: 3rem;"/>
          </button>
        );
      }

      const styles2 = css\`
        .blue {
          color: blue;
        }
      \`;

      const P = styled('p')\`
        color: blue;
      \`;
    `;

    it('should inject requires in the right order (babel)', async () => {
      const [code] = await run(cjsCode, {
        enableCssProp: true,
        // astroturf doesn't detect require('astroturf') for css or styled tags
        allowGlobal: true,
      });

      expect(code).toContain(
        format`
          const _j = require("astroturf/jsx");
          const Component = require("./Foo");
          const Component2 = require("./Foo2");
          const _styles = require("./MyStyleFile-styles.module.css");
          const _CssProp1_button = require("./MyStyleFile-CssProp1_button.module.css");
          const _CssProp2_span = require("./MyStyleFile-CssProp2_span.module.css");
          const _styles2 = require("./MyStyleFile-styles2.module.css");
          const _P = require("./MyStyleFile-P.module.css");
      `,
      );
    });
    it('should inject requires in the right order (webpack)', async () => {
      const [code] = await runLoader(cjsCode, {
        enableCssProp: true,
        allowGlobal: true,
      });

      expect(code).toContain(
        format`
          const _j = require("astroturf/jsx");

          const Component = require("./Foo");
          const Component2 = require("./Foo2");
          const _styles = require("${buildLoaderRequest('styles')}");
          const _CssProp1_button = require("${buildLoaderRequest(
            'CssProp1_button',
          )}");
          const _CssProp2_span = require("${buildLoaderRequest(
            'CssProp2_span',
          )}");
          const _styles2 = require("${buildLoaderRequest('styles2')}");
          const _P = require("${buildLoaderRequest('P')}");
      `,
      );
    });
  });
});
