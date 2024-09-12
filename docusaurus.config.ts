import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {DOCS_ROOT, SCRIPTS_ROOT} from "./config/builderConfig";
import {loadConfigForActiveSite} from "./framework/builder/siteConfigLoader";
import {Log} from "./framework/util/log";
import {buildScripts} from "./framework/builder/scriptsBuilder";
import {remarkContainerDirectivesConfig} from "./src/plugin-configs/remark-container-directives/plugin-config";
import remarkContainerDirectives from "./src/plugins/remark-container-directives/plugin";
import remarkLineDirectives from "./src/plugins/remark-line-directives/plugin";
import {remarkLineDirectivesPluginConfig} from "./src/plugin-configs/remark-line-directives/plugin-config";
import math from "remark-math";
import katex from "rehype-katex";
import remarkImageToFigure from "./src/plugins/remark-image-to-figure/plugin";
import remarkKdb from "./src/plugins/remark-kbd/plugin";
import remarkMdi from "./src/plugins/remark-mdi/plugin";
import remarkStrong from "./src/plugins/remark-strong/plugin";
import remarkFlexCards from "./src/plugins/remark-flex-cards/plugin";
import remarkDeflist from "./src/plugins/remark-deflist/plugin";

require('dotenv').config();

const siteConfig = loadConfigForActiveSite();
Log.instance.info(`🔧 Building site '${siteConfig.siteId}'`);

const scriptRoots = buildScripts(siteConfig.properties.scriptsConfigsFile);
const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);

Log.instance.info(`📂 Creating docs plugin roots: [${scriptRoots}]`);

const remarkPlugins = [
  math,
  remarkFlexCards,
  [remarkStrong, {className: 'boxed'}],
  [
    remarkDeflist,
    {
      tagNames: {
        dl: 'Dl',
      },
    }
  ],
  remarkKdb,
  [
    remarkMdi,
    {
      colorMapping: {
        green: 'var(--ifm-color-success)',
        red: 'var(--ifm-color-danger)',
        orange: 'var(--ifm-color-warning)',
        yellow: '#edcb5a',
        blue: '#3578e5',
        cyan: '#01f0bc'
      },
      defaultSize: '1.25em'
    }
  ],
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

const navbarItems = [
  ...siteConfig.properties.navbarItems,
];

// Add docs config for docs root to enable hot reload and provide access to all docs.
if (process.env.NODE_ENV !== 'debug') {
  docsConfigs.push([
    '@docusaurus/plugin-content-docs',
    {
      id: 'all_docs',
      path: `${DOCS_ROOT}`,
      routeBasePath: `docs`,
      sidebarPath: `./config/sidebars/docs.sidebars.ts`,
      remarkPlugins: remarkPlugins,
      rehypePlugins: rehypePlugins,
    }
  ]);
  navbarItems.push(
    {to: 'docs', label: '📄 Docs', position: 'right'},
  )
}

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
          customCss: [require.resolve('./src/css/styles.scss')],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
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
      items: navbarItems,
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
