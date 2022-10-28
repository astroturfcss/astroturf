import { MDXProvider } from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';
import type { Props } from '@theme/MDXContent';
import React from 'react';

export default function MDXContent({ children }: Props): JSX.Element {
  return <MDXProvider components={MDXComponents}>{children}</MDXProvider>;
}
