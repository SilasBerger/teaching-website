import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, PluginOptions} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {loadSiteConfig} from "./src/builder/site-config-loader";
import {buildScripts} from "./src/builder/scripts-builder";
import {SCRIPTS_ROOT} from "./config/builder-config";
import * as osPath from "path";
import { Logger } from './src/builder/util/logger';
import remarkMdi from "./src/plugins/remark-mdi";
import remarkFencedBlocks from "./src/plugins/remark-fenced-blocks";
import {fencedBlocksConfig} from "./src/pluginConfigs/remark-fenced-blocks.plugin-config";

const siteConfig = loadSiteConfig();
Logger.instance.info(`🔧 Building site '${siteConfig.siteId}'`);

const scriptRoots = buildScripts(siteConfig.properties.scriptsConfigsFile);

Logger.instance.info(`📂 Creating docs plugin roots: [${scriptRoots}]`);
const admonitionConfig = {
  keywords: ['danger', 'warning', 'key', 'definition', 'insight', 'tip'],
};

const docsConfigs = scriptRoots.map((scriptRoot, index) => {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id: `${scriptRoot}`.replace('/', '_'),
      path: `${SCRIPTS_ROOT}${scriptRoot}`,
      routeBasePath: `${scriptRoot}`,
      sidebarPath: `./config/sidebars/${siteConfig.siteId}.sidebars.ts`,
      admonitions: admonitionConfig,
      remarkPlugins: [
        remarkMdi,
        [remarkFencedBlocks, fencedBlocksConfig]
      ]
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
          path: siteConfig.properties.pagesRoot,
          admonitions: admonitionConfig,
          remarkPlugins: [
            remarkMdi,
            [remarkFencedBlocks, fencedBlocksConfig]
          ]
        },
        docs: false,
        theme: {
          customCss: [require.resolve('./src/css/styles.scss')],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
    function (context: LoadContext, options: PluginOptions){
      return {
        name: 'configure-watch-paths',
        getPathsToWatch() {
          return [
            osPath.resolve(__dirname, 'content'),
            osPath.resolve(__dirname, 'config'),
          ]
        },
      }
    },
    ...docsConfigs
  ],

  // Enable mermaid diagram blocks in Markdown
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

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
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
    footer: siteConfig.properties.footer,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
