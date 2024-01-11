import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, PluginOptions} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {SCRIPTS_ROOT} from "./config/builder-config";
import * as osPath from "path";
import {loadConfigForActiveSite} from "./src/framework/builder/site-config-loader";
import {Log} from "./src/framework/util/log";
import {buildScripts} from "./src/framework/builder/scripts-builder";
import {
  fencedBlocksConfig,
  fencedBlocksDefinedKeywords
} from "./src/framework/pluginConfigs/remark-fenced-blocks.plugin-config";
import remarkMdi from "./src/framework/plugins/remark-mdi";
import remarkFencedBlocks from "./src/framework/plugins/remark-fenced-blocks";
import remarkSpecialLinks from "./src/framework/plugins/remark-special-links";
import {specialLinksConfig} from "./src/framework/pluginConfigs/remark-special-links.plugin-config";


const siteConfig = loadConfigForActiveSite();
Log.instance.info(`🔧 Building site '${siteConfig.siteId}'`);

const scriptRoots = buildScripts(siteConfig.properties.scriptsConfigsFile);

Log.instance.info(`📂 Creating docs plugin roots: [${scriptRoots}]`);

const admonitionConfig = {
  keywords: fencedBlocksDefinedKeywords(),
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
        [remarkFencedBlocks, fencedBlocksConfig],
        [remarkSpecialLinks, specialLinksConfig],
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
          customCss: [require.resolve('./src/app/css/styles.scss')],
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
