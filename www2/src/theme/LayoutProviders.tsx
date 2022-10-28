import { DocsPreferredVersionContextProvider } from '@docusaurus/theme-common';
import type { Props } from '@theme/LayoutProviders';
import React from 'react';

export default function LayoutProviders({ children }: Props): JSX.Element {
  return <>{children}</>;
}
