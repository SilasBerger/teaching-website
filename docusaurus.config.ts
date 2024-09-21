import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {DOCS_ROOT, SCRIPTS_ROOT} from "./config/builderConfig";
import {loadConfigForActiveSite} from "./framework/builder/siteConfigLoader";
import {Log} from "./framework/util/log";
import {remarkContainerDirectivesConfig} from "./src/plugin-configs/remark-container-directives/plugin-config";
import {remarkLineDirectivesPluginConfig} from "./src/plugin-configs/remark-line-directives/plugin-config";
import remarkContainerDirectives from "./src/plugins/remark-container-directives/plugin";
import remarkLineDirectives from "./src/plugins/remark-line-directives/plugin";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import * as path from "node:path";
import kbdPlugin from "./src/sharedPlugins/remark-kbd/plugin";
import mdiPlugin from "./src/sharedPlugins/remark-mdi/plugin";
import imagePlugin from "./src/sharedPlugins/remark-images/plugin";
import flexCardsPlugin from "./src/sharedPlugins/remark-flex-cards/plugin";
import strongPlugin from "./src/sharedPlugins/remark-strong/plugin";
import deflistPlugin from "./src/sharedPlugins/remark-deflist/plugin";
import detailsPlugin from "./src/sharedPlugins/remark-details/plugin";
import defboxPlugin from "./src/sharedPlugins/remark-code-defbox/plugin";
import mediaPlugin from "./src/sharedPlugins/remark-media/plugin";
import enumerateAnswersPlugin from "./src/sharedPlugins/remark-enumerate-components/plugin";
import themeCodeEditor from "./src/sharedPlugins/theme-code-editor";
import {promises as fs} from "fs";
import matter from "gray-matter";
import {v4 as uuidv4} from 'uuid';
import {ScriptsBuilder} from "./framework/builder/scriptsBuilder";

require('dotenv').config();

const siteConfig = loadConfigForActiveSite();

const scriptRoots = process.env.NODE_ENV === 'development'
  ? ScriptsBuilder.watch(siteConfig)
  : ScriptsBuilder.buildOnce(siteConfig);

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

const docsConfigs = scriptRoots.map((scriptRoot, index) => {
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

// Add docs config for docs root to enable hot reload and provide access to all docs.
if (process.env.NODE_ENV === 'development') {
  docsConfigs.push([
    '@docusaurus/plugin-content-docs',
    {
      id: 'all_docs',
      path: `${DOCS_ROOT}`,
      routeBasePath: `docs`,
      sidebarPath: `./config/sidebars/docs.sidebars.ts`,
      remarkPlugins: REMARK_PLUGINS,
      rehypePlugins: REHYPE_PLUGINS,
      beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
    }
  ]);
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

  onBrokenLinks: 'warn', // TODO: Fix broken links, change back to 'throw'.
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    /** Use Testuser in local dev: set TEST_USERNAME to the test users email adress*/
    TEST_USERNAME: process.env.TEST_USERNAME,
    /** User.ts#isStudent returns `true` for users matching this pattern. If unset, it returns `true` for all non-admin users. */
    STUDENT_USERNAME_PATTERN: process.env.STUDENT_USERNAME_PATTERN,
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
          remarkPlugins: REMARK_PLUGINS,
          rehypePlugins: REHYPE_PLUGINS,
          beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
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
    () => {
      return {
        name: 'alias-configuration',
        configureWebpack(config, isServer, utils, content) {
          return {
            resolve: {
              alias: {
                '@tdev-components': path.resolve(__dirname, './src/sharedComponents'),
                '@tdev-hooks': path.resolve(__dirname, './src/hooks'),
                '@tdev-models': path.resolve(__dirname, './src/models'),
                '@tdev-stores': path.resolve(__dirname, './src/stores'),
                '@tdev-api': path.resolve(__dirname, './src/api'),
                '@tdev': path.resolve(__dirname, './src'),
              }
            }
          }
        }
      }
    },
    ...docsConfigs
  ],

  // Enable mermaid diagram blocks in Markdown
  markdown: {
    mermaid: true,
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      if (process.env.NODE_ENV !== 'production') {
        if (!('page_id' in result.frontMatter)) {
          result.frontMatter.page_id = uuidv4();
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
    "@docusaurus/theme-mermaid",
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
      items: siteConfig.properties.navbarItems.filter(item => !!item), // Some items may be null.
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
