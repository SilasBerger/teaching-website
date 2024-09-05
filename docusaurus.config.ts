import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, PluginOptions} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {SCRIPTS_ROOT} from "./config/builder-config";
import * as osPath from "path";
import {loadConfigForActiveSite} from "./framework/builder/site-config-loader";
import {Log} from "./framework/util/log";
import {buildScripts} from "./framework/builder/scripts-builder";

import {remarkContainerDirectivesConfig} from "./src/plugin-configs/remark-container-directives/plugin-config";
import remarkContainerDirectives from "./src/plugins/remark-container-directives/plugin";
import remarkLineDirectives from "./src/plugins/remark-line-directives/plugin";
import {remarkLineDirectivesPluginConfig} from "./src/plugin-configs/remark-line-directives/plugin-config";

import strongPlugin from './src/plugins/remark-strong/plugin';
import deflistPlugin from './src/plugins/remark-deflist/plugin';
import mdiPlugin from './src/plugins/remark-mdi/plugin';
import kbdPlugin from './src/plugins/remark-kbd/plugin';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import defboxPlugin from './src/plugins/remark-code-defbox/plugin';
import flexCardsPlugin from './src/plugins/remark-flex-cards/plugin';
import imagePlugin from './src/plugins/remark-images/plugin';
import mediaPlugin from './src/plugins/remark-media/plugin';
import detailsPlugin from './src/plugins/remark-details/plugin';
import themeCodeEditor from './src/plugins/theme-code-editor'
import enumerateAnswersPlugin from './src/plugins/remark-enumerate-components/plugin';
import { v4 as uuidv4 } from 'uuid';
import matter from 'gray-matter';
import { promises as fs } from 'fs';

require('dotenv').config();

const siteConfig = loadConfigForActiveSite();
Log.instance.info(`🔧 Building site '${siteConfig.siteId}'`);

const BUILD_LOCATION = __dirname;

const scriptRoots = buildScripts(siteConfig.properties.scriptsConfigsFile);
const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);

Log.instance.info(`📂 Creating docs plugin roots: [${scriptRoots}]`);

const BEFORE_DEFAULT_REMARK_PLUGINS = [
  flexCardsPlugin,
  [
    imagePlugin,
    { tagNames: { sourceRef: 'SourceRef', figure: 'Figure' } }
  ],
  detailsPlugin,
  defboxPlugin
];

const REMARK_PLUGINS = [
  [strongPlugin, { className: 'boxed' }],
  [
    deflistPlugin,
    {
      tagNames: {
        dl: 'Dl',
      },
    }
  ],
  [
    mdiPlugin,
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
  mediaPlugin,
  kbdPlugin,
  remarkMath,
  [
    enumerateAnswersPlugin,
    {
      componentsToEnumerate: ['Answer', 'TaskState'],
    }
  ],
  [remarkContainerDirectives, remarkContainerDirectivesConfig],
  [remarkLineDirectives, remarkLineDirectivesPluginConfig],
];
const REHYPE_PLUGINS = [
  rehypeKatex
]

const docsConfigs = scriptRoots.map((scriptRoot) => {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id: `${scriptRoot}`.replace('/', '_'),
      path: `${SCRIPTS_ROOT}${scriptRoot}`,
      routeBasePath: `${scriptRoot}`,
      sidebarPath: `./config/sidebars/${siteConfig.siteId}.sidebars.ts`,
      remarkPlugins: REMARK_PLUGINS,
      rehypePlugins: REHYPE_PLUGINS,
      beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
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

  onBrokenLinks: 'warn', // TODO: Throw.
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    /** Use Testuser in local dev: set TEST_USERNAME to the test users email adress*/
    TEST_USERNAME: process.env.TEST_USERNAME,
    NO_AUTH: process.env.NODE_ENV !== 'production' && !!process.env.TEST_USERNAME,
    /** The Domain Name where the api is running */
    APP_URL: process.env.NETLIFY
      ? process.env.DEPLOY_PRIME_URL
      : process.env.APP_URL || 'http://localhost:3000',
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

  markdown: {
    mermaid: true,
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      /**
       * don't edit blogs frontmatter
       */
      if (params.filePath.startsWith(`${BUILD_LOCATION}/blog/`)) {
        return result;
      }
      if (process.env.NODE_ENV !== 'production') {
        let needsRewrite = false;
        /**
         * material on ofi.gbsl.website used to have 'sidebar_custom_props.id' as the page id.
         * Rewrite it as 'page_id' and remove it in case it's present.
         */
        if ('sidebar_custom_props' in result.frontMatter && 'id' in (result.frontMatter as any).sidebar_custom_props) {
          if (!('page_id' in result.frontMatter)) {
            result.frontMatter.page_id = (result.frontMatter as any).sidebar_custom_props.id;
            needsRewrite = true;
          }
          delete (result.frontMatter as any).sidebar_custom_props.id;
          if (Object.keys((result.frontMatter as any).sidebar_custom_props).length === 0) {
            delete result.frontMatter.sidebar_custom_props;
          }
        }
        if (!('page_id' in result.frontMatter)) {
          result.frontMatter.page_id = uuidv4();
          needsRewrite = true;
        }
        if (needsRewrite) {
          await fs.writeFile(
            params.filePath,
            matter.stringify(params.fileContent, result.frontMatter),
            { encoding: 'utf-8' }
          )
        }
      }
      return result;
    }
  },

  presets: [
    [
      'classic',
      {
        pages: {
          path: siteConfig.properties.pagesRoot,
          remarkPlugins: REMARK_PLUGINS,
          rehypePlugins: REHYPE_PLUGINS,
          beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
        },
        docs: false,
        theme: {
          customCss: './src/css/custom.scss',
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
    ...docsConfigs,
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'docs',
        path: 'docs',
        routeBasePath: 'docs',
        sidebarPath: './config/sidebars/docs.sidebars.ts',
        remarkPlugins: REMARK_PLUGINS,
        rehypePlugins: REHYPE_PLUGINS,
        beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
      }
    ]
  ],

  stylesheets: [
    {
      // https://stackoverflow.com/questions/72005500/weird-plain-text-duplication-in-mdx-after-latex-equation
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],

  themes: [
    [themeCodeEditor, {}]
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
        {
          type: 'custom-taskStateOverview',
          position: 'left'
        },
        {
          type: 'custom-accountSwitcher',
          position: 'right'
        },
        {
          type: 'custom-loginProfileButton',
          position: 'right'
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
      additionalLanguages: ['bash', 'typescript', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

console.log(`🚀 Building for APP_URL ${config.customFields?.APP_URL} with NO_AUTH=${config.customFields?.NO_AUTH}`);

export default config;
