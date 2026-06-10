import siteConfig from '@generated/docusaurus.config';
const { DIRECTUS_URL } = siteConfig.customFields as {
    DIRECTUS_URL: string;
};

export { DIRECTUS_URL };
