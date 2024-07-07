// Source: https://github.com/GBSL-Informatik/teaching-dev/blob/main/src/theme/Root.tsx
// TODO: Diff with source when introducing MSAL / auth.
// TODO: Diff with source when introducing document API connection.

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {rootStore, StoresProvider} from "@site/src/app/stores/rootStore";


// Default implementation, that you can customize
function Root({ children }) {
  React.useEffect(() => {
    if (!rootStore) {
      return;
    }
    if (window) {
      (window as any).store = rootStore;
    }
    return () => {
      /**
       * TODO: cleanup the store
       * - remove all listeners
       * - clear all data
       * - disconnect all sockets
       */
      // rootStore?.cleanup();
    };
  }, [rootStore]);

  const { siteConfig } = useDocusaurusContext();
  React.useEffect(() => {
    /**
     * Expose the store to the window object
     */
    (window as any).store = rootStore;
  }, [rootStore]);

  return (
    <>
      <Head>
        <meta property="og:description" content={siteConfig.tagline} />
        <meta property="og:image" content={`${siteConfig.customFields.DOMAIN}/img/og-preview.jpeg`} />
      </Head>
      <StoresProvider value={rootStore}>
        {children}
      </StoresProvider>
    </>
  );
}

export default Root;
