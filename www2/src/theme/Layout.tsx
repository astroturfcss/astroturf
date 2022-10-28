import Head from '@docusaurus/Head';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { Props } from '@theme/Layout';
import { css } from 'astroturf';
// import Navbar from '@theme/Navbar';
import React from 'react';

import LayoutProviders from './LayoutProviders';

function Layout(props: Props): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const {
    favicon,
    title: siteTitle,
    themeConfig: { image: defaultImage, metadatas },
    url: siteUrl,
  } = siteConfig;
  const { children, title, description, image, keywords, permalink } = props;
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  const metaImage = image || defaultImage;
  let metaImageUrl = siteUrl + useBaseUrl(metaImage);
  if (!isInternalUrl(metaImage)) {
    metaImageUrl = metaImage;
  }
  const faviconUrl = useBaseUrl(favicon);

  return (
    <LayoutProviders>
      <Head>
        {/* TODO: Do not assume that it is in english language */}
        <html lang="en" />

        {metaTitle && <title>{metaTitle}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {Array.isArray(keywords) && (
          <meta name="keywords" content={keywords.join(',')} />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Head
      // it's important to have an additional <Head> element here,
      // as it allows react-helmet to override values set in previous <Head>
      // ie we can override default metadatas such as "twitter:card"
      // In same Head, the same meta would appear twice instead of overriding
      // See react-helmet doc
      >
        {metadatas?.length > 0 &&
          metadatas.map((metadata: any, i: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <meta key={`metadata_${i}`} {...metadata} />
          ))}
      </Head>

      <main
        css={css`
          margin: 0 auto;
          max-width: theme('screens.sm');
          padding: theme('padding.6');
        `}
      >
        {props.children}
      </main>
    </LayoutProviders>
  );
}

export default Layout;
