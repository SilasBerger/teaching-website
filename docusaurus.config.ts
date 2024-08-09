import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, PluginOptions} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {SCRIPTS_ROOT} from "./config/builder-config";
import * as osPath from "path";
import {loadConfigForActiveSite} from "./src/framework/builder/site-config-loader";
import {Log} from "./src/framework/util/log";
import {buildScripts} from "./src/framework/builder/scripts-builder";
import {remarkContainerDirectivesConfig} from "./src/framework/plugin-configs/remark-container-directives/plugin-config";
import remarkContainerDirectives from "./src/framework/plugins/remark-container-directives/plugin";
import remarkLineDirectives from "./src/framework/plugins/remark-line-directives/plugin";
import {remarkLineDirectivesPluginConfig} from "./src/framework/plugin-configs/remark-line-directives/plugin-config";
import math from "remark-math";
import katex from "rehype-katex";
import remarkImageToFigure from "./src/framework/plugins/remark-image-to-figure/plugin";

require('dotenv').config();

const siteConfig = loadConfigForActiveSite();
Log.instance.info(`🔧 Building site '${siteConfig.siteId}'`);

const scriptRoots = buildScripts(siteConfig.properties.scriptsConfigsFile);
const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);

Log.instance.info(`📂 Creating docs plugin roots: [${scriptRoots}]`);

const remarkPlugins = [
  math,
  [remarkContainerDirectives, remarkContainerDirectivesConfig],
  [remarkLineDirectives, remarkLineDirectivesPluginConfig],
  remarkImageToFigure,
];

const rehypePlugins = [
  katex,
];

const docsConfigs = scriptRoots.map((scriptRoot, index) => {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id: `${scriptRoot}`.replace('/', '_'),
      path: `${SCRIPTS_ROOT}${scriptRoot}`,
      routeBasePath: `${scriptRoot}`,
      sidebarPath: `./config/sidebars/${siteConfig.siteId}.sidebars.ts`,
      remarkPlugins: remarkPlugins,
      rehypePlugins: rehypePlugins,
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

  customFields: {
    /** Use Testuser in local dev: set TEST_USERNAME to the test users email adress*/
    TEST_USERNAME: process.env.TEST_USERNAME,
    NO_AUTH: process.env.NODE_ENV !== 'production' && !!process.env.TEST_USERNAME,
    /** The Domain Name where the api is running */
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    /** The Domain Name of this app */
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3002',
    /** The application id generated in https://portal.azure.com */
    CLIENT_ID: process.env.CLIENT_ID,
    /** Tenant / Verzeichnis-ID (Mandant) */
    TENANT_ID: process.env.TENANT_ID,
    /** The application id uri generated in https://portal.azure.com */
    API_URI: process.env.API_URI,
    GIT_COMMIT_SHA: GIT_COMMIT_SHA,
  },

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
          remarkPlugins: remarkPlugins,
          rehypePlugins: rehypePlugins,
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
  stylesheets: [
    {
      // https://stackoverflow.com/questions/72005500/weird-plain-text-duplication-in-mdx-after-latex-equation
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],
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

console.log(`🚀 Building for APP_URL ${config.customFields.APP_URL} with NO_AUTH=${config.customFields.NO_AUTH}`);

export default config;
