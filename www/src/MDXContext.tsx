import { MDXProvider } from '@mdx-js/react';
import styled from 'astroturf/react';
import { Link } from 'react-router-dom';

import CodeBlock from './CodeBlock';

export default {
  // Re-use the default mapping
  code: (props) => {
    const { children } = props;

    if (typeof children === 'string') {
      if (!children.includes('\n')) {
        return (
          <code
            {...props}
            className="text-primary bg-secondary-darker bg-opacity-75 rounded px-1"
          />
        );
      }
      return <CodeBlock {...props} />;
    }
    return children;
  },
  a: (props) => <Link {...props} />,
  pre: (props) => <div {...props} />,
  ul: (props) => <ul {...props} className="pl-8 list-disc" />,
  ol: (props) => <ul {...props} className="pl-8 list-decimal" />,

  Brand: (props: any) => <span {...props} className="font-brand" />,
};
