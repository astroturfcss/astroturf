import { format, loaderPrefix, run, runLoader } from './helpers';

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
          import _styles from "./MyStyleFile-styles.css";
          import _CssProp1_button from "./MyStyleFile-CssProp1_button.css";
          import _CssProp2_span from "./MyStyleFile-CssProp2_span.css";
          import _styles2 from "./MyStyleFile-styles2.css";
          import _P from "./MyStyleFile-P.css";
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
          import _styles from "${loaderPrefix}./MyStyleFile-styles.css";
          import _CssProp1_button from "${loaderPrefix}./MyStyleFile-CssProp1_button.css";
          import _CssProp2_span from "${loaderPrefix}./MyStyleFile-CssProp2_span.css";
          import _styles2 from "${loaderPrefix}./MyStyleFile-styles2.css";
          import _P from "${loaderPrefix}./MyStyleFile-P.css";
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
          const _styles = require("./MyStyleFile-styles.css");
          const _CssProp1_button = require("./MyStyleFile-CssProp1_button.css");
          const _CssProp2_span = require("./MyStyleFile-CssProp2_span.css");
          const _styles2 = require("./MyStyleFile-styles2.css");
          const _P = require("./MyStyleFile-P.css");
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
          const _styles = require("${loaderPrefix}./MyStyleFile-styles.css");
          const _CssProp1_button = require("${loaderPrefix}./MyStyleFile-CssProp1_button.css");
          const _CssProp2_span = require("${loaderPrefix}./MyStyleFile-CssProp2_span.css");
          const _styles2 = require("${loaderPrefix}./MyStyleFile-styles2.css");
          const _P = require("${loaderPrefix}./MyStyleFile-P.css");
      `,
      );
    });
  });
});
