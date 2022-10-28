import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  DocsSidebarProvider,
  DocsVersionProvider,
  useDocRouteMetadata,
} from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/DocPage';
import DocPageLayout from '@theme/DocPageLayout';
import clsx from 'clsx';
import React from 'react';

function DocPageMetadata(props: Props): JSX.Element {
  const { versionMetadata } = props;
  return (
    <>
      <PageMetadata>
        {versionMetadata.noIndex && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </PageMetadata>
    </>
  );
}

export default function DocPage(props: Props): JSX.Element {
  // const { versionMetadata } = props;
  const currentDocRouteMetadata = useDocRouteMetadata(props);
  if (!currentDocRouteMetadata) {
    return null;
  }
  const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata;

  console.log(docElement);
  return (
    <>
      <DocPageMetadata {...props} />
      <HtmlClassNameProvider
        className={clsx(
          // TODO: it should be removed from here
          ThemeClassNames.wrapper.docsPages,
          ThemeClassNames.page.docsDocPage,
          props.versionMetadata.className,
        )}
      >
        {/* <DocsVersionProvider version={versionMetadata}> */}
        {/* <DocsSidebarProvider name={sidebarName} items={sidebarItems}> */}
        <DocPageLayout>{docElement}</DocPageLayout>
        {/* </DocsSidebarProvider> */}
        {/* </DocsVersionProvider> */}
      </HtmlClassNameProvider>
    </>
  );
}
