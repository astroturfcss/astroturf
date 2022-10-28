import Link from '@docusaurus/Link';
import Brand from '@site/src/components/Brand';
import styled from 'astroturf/react';
import React from 'react';

// import CodeBlock from '@site/src/components/CodeBlock';

const InlineCode = styled('code')`
  @apply text-primary bg-secondary-darker bg-opacity-75 rounded px-1;
`;

export default {
  // Re-use the default mapping
  code: (props) => {
    const { children } = props;
    if (typeof children === 'string') {
      if (!children.includes('\n')) {
        return <InlineCode {...props} />;
      }
      return <code {...props} />;
    }
    return children;
  },
  a: (props) => <Link {...props} />,
  pre: (props) => <div {...props} />,
  // h1: Heading('h1'),
  // h2: Heading('h2'),
  // h3: Heading('h3'),
  // h4: Heading('h4'),
  // h5: Heading('h5'),
  // h6: Heading('h6'),
  ul: (props) => <ul {...props} className="pl-8 list-disc" />,
  ol: (props) => <ul {...props} className="pl-8 list-decimal" />,

  // Map the "highlight" tag to our <Highlight /> component!
  // `Highlight` will receive all props that were passed to `highlight` in MDX
  brand: Brand,
};
