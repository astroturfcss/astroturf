import { HtmlClassNameProvider } from '@docusaurus/theme-common';
// import { DocProvider } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/DocItem';
import React from 'react';

export default function DocItem(props: Props): JSX.Element {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.unversionedId}`;
  const MDXComponent = props.content;
  return (
    // <DocProvider content={props.content}>
    <HtmlClassNameProvider className={docHtmlClassName}>
      {/* <DocItemMetadata /> */}
      {/* <DocItemLayout> */}
      <MDXComponent />
      {/* </DocItemLayout> */}
    </HtmlClassNameProvider>
    // </DocProvider>
  );
}
