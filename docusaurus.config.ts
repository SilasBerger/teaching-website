import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {loadSiteConfig} from "./src/builder/site-loader";
import {buildScripts} from "./src/builder/scripts-builder";
import {SCRIPTS_ROOT} from "./config/builder-config";

const siteConfig = loadSiteConfig();
console.log(`🔧 Building site '${siteConfig.siteId}'`);

const scriptRoots = buildScripts(siteConfig.properties.scriptsConfigsFile);

console.log(`📂 Creating docs plugin roots: [${scriptRoots}]`);
const docsConfigs = scriptRoots.map((scriptRoot, index) => {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id: `${scriptRoot}`,
      path: `${SCRIPTS_ROOT}${scriptRoot}`,
      routeBasePath: `${scriptRoot}`,
      sidebarPath: `./config/sidebars/${siteConfig.siteId}.sidebars.ts`
    }
  ];
});

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
        docs: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    ...docsConfigs
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

    footer: siteConfig.properties.footer,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
