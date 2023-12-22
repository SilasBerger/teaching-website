import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {loadSiteConfig} from "./src/builder/site-loader";
import {buildScripts} from "./src/builder/scripts-builder";

const siteConfig = loadSiteConfig();
console.log(`🔧 Building site '${siteConfig.siteId}'`);

const scriptIds = buildScripts(siteConfig.properties.scriptsConfigsFile);

console.log(`📂 Creating docs plugin roots: [${scriptIds}]`);
// TODO: Implement (or maybe this should be hard-coded in the same place as the sidebars, since they need to match).

const config: Config = {
  title: siteConfig.properties.pageTitle,
  tagline: siteConfig.properties.tagline,
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: siteConfig.properties.pageBaseUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
  },

  presets: [
    [
      'classic',
      {
        pages: {
          path: siteConfig.properties.pagesRoot
        },
        docs: { // TODO: Remove this, if possible.
          path: 'content/material',
          routeBasePath: 'material',
          sidebarPath: './config/sidebars/sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: siteConfig.properties.pageTitle,
      logo: {
        alt: `Logo ${siteConfig.properties.pageTitle}`,
        src: 'img/logo.svg',
      },
      items: [
        ...siteConfig.properties.navbarItems,
        {
          href: 'https://github.com/SilasBerger/teaching-website',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    // TODO: Get footer links from config loader.
    footer: siteConfig.properties.footer,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
