import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, CurrentBundler} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { VersionOptions } from '@docusaurus/plugin-content-docs';
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
import linkAnnotationPlugin from './src/sharedPlugins/remark-link-annotation/plugin';
import flexCardsPlugin from "./src/sharedPlugins/remark-flex-cards/plugin";
import strongPlugin from "./src/sharedPlugins/remark-strong/plugin";
import deflistPlugin from "./src/sharedPlugins/remark-deflist/plugin";
import detailsPlugin from "./src/sharedPlugins/remark-details/plugin";
import pagePlugin from './src/sharedPlugins/remark-page/plugin';
import defboxPlugin from "./src/sharedPlugins/remark-code-defbox/plugin";
import mediaPlugin from "./src/sharedPlugins/remark-media/plugin";
import pdfPlugin from './src/sharedPlugins/remark-pdf/plugin';
import commentPlugin from './src/sharedPlugins/remark-comments/plugin';
import enumerateAnswersPlugin from "./src/sharedPlugins/remark-enumerate-components/plugin";
import themeCodeEditor from "./src/sharedPlugins/theme-code-editor";
import {promises as fs} from "fs";
import matter from "gray-matter";
import {v4 as uuidv4} from 'uuid';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import siteConfig from './siteConfig';
import { ScriptsBuilder } from './framework/builder/scriptsBuilder';

require('dotenv').config();

process.env.NODE_ENV === 'development'
  ? ScriptsBuilder.watch(siteConfig)
  : ScriptsBuilder.buildOnce(siteConfig);

const BUILD_LOCATION = __dirname;
const GIT_COMMIT_SHA = process.env.GITHUB_SHA || Math.random().toString(36).substring(7);

const BEFORE_DEFAULT_REMARK_PLUGINS = [
  flexCardsPlugin,
  [
    deflistPlugin,
    {
      tagNames: {
        dl: 'Dl',
      },
    }
  ],
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
      componentsToEnumerate: ['Answer', 'TaskState', 'SelfCheckTaskState'],
    }
  ],
  pdfPlugin,
  pagePlugin,
  [remarkContainerDirectives, remarkContainerDirectivesConfig],
  [remarkLineDirectives, remarkLineDirectivesPluginConfig],
  [
    commentPlugin,
    {
      commentableJsxFlowElements: ['dd', 'DefHeading', 'figcaption', 'String'],
      ignoreJsxFlowElements: ['summary', 'dt'],
      ignoreCodeBlocksWithMeta: /live_py/
    }
  ],
  [
    linkAnnotationPlugin,
    {
      prefix: '👉',
      postfix: null
    }
  ],
];
const REHYPE_PLUGINS = [
  rehypeKatex
]

const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const cMapsDir = path.join(pdfjsDistPath, 'cmaps');
const getCopyPlugin = (
  currentBundler: CurrentBundler
): typeof CopyWebpackPlugin => {
  if (currentBundler.name === 'rspack') {
    // @ts-expect-error: this exists only in Rspack
    return currentBundler.instance.CopyRspackPlugin;
  }
  return CopyWebpackPlugin;
}

const ORGANIZATION_NAME = 'SilasBerger';
const PROJECT_NAME = 'teaching-website';
const TEST_USERNAMES = (process.env.TEST_USERNAMES?.split(';') || []).map((u) => u.trim()).filter(u => !!u);

const versions: {[key: string]: VersionOptions } = {
  'current': {
    badge: false,
    banner: 'none',
    path: 'docs',
  },
};
ScriptsBuilder.readScriptNames(siteConfig).forEach((scriptName: string) => {
  versions[scriptName] = {
    badge: false,
    banner: 'none',
  };
});

const config: Config = {
  title: siteConfig.pageTitle,
  tagline: siteConfig.tagline,
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: siteConfig.pageBaseUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config. Also used for CMS.
  organizationName: ORGANIZATION_NAME, // Usually your GitHub org/user name.
  projectName: PROJECT_NAME, // Usually your repo name.

  onBrokenLinks: 'warn', // TODO: Fix broken links, change back to 'throw'.
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    /** Use Testuser in local dev: set TEST_USERNAME to the test users email adress*/
    TEST_USERNAMES: TEST_USERNAMES,
    /** User.ts#isStudent returns `true` for users matching this pattern. If unset, it returns `true` for all non-admin users. */
    STUDENT_USERNAME_PATTERN: process.env.STUDENT_USERNAME_PATTERN,
    NO_AUTH: process.env.NODE_ENV !== 'production' && TEST_USERNAMES.length > 0,
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
    SENTRY_DSN: process.env.SENTRY_DSN,
    CIPHERLOCK_SERVER_URL: process.env.CIPHERLOCK_SERVER_URL,
  },

  future: {
    experimental_faster: {
      /**
       * no config options for swcJsLoader so far.
       * Instead configure it over the jsLoader in the next step
       */
      swcJsLoader: false,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
    },
  },
  webpack: {
    jsLoader: (isServer) => {
      const defaultOptions = require("@docusaurus/faster").getSwcLoaderOptions({isServer});
      return {
        loader: 'builtin:swc-loader', // (only works with Rspack)
        options: {
          ...defaultOptions,
          jsc: {
            parser: {
              ...defaultOptions.jsc.parser,
              decorators: true
            },
            transform: {
              ...defaultOptions.jsc.transform,
              decoratorVersion: '2022-03',              
            }
          },
        },
      }
    },
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
          path: siteConfig.pagesRoot,
          remarkPlugins: REMARK_PLUGINS,
          rehypePlugins: REHYPE_PLUGINS,
          beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
        },
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: `/cms/${ORGANIZATION_NAME}/${PROJECT_NAME}/`,
          remarkPlugins: REMARK_PLUGINS,
          rehypePlugins: REHYPE_PLUGINS,
          beforeDefaultRemarkPlugins: BEFORE_DEFAULT_REMARK_PLUGINS,
          lastVersion: 'current',
          routeBasePath: '',
          versions: versions,
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.scss')],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
    process.env.RSDOCTOR === 'true' && [
      'rsdoctor',
      {
        rsdoctorOptions: {
        },
      },
    ],
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
    () => {
      const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
      const SENTRY_ORG = process.env.SENTRY_ORG;
      const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
      if (!SENTRY_AUTH_TOKEN || !SENTRY_ORG || !SENTRY_PROJECT) {
        console.warn(
          'Sentry is not configured. Please set SENTRY_AUTH_TOKEN, SENTRY_ORG and SENTRY_PROJECT in your environment variables.'
        );
        return {name: 'sentry-configuration'};
      }
      return {
        name: 'sentry-configuration',
        configureWebpack(config, isServer, utils, content) {
            return {
              devtool: 'source-map',
              plugins: [
                sentryWebpackPlugin({
                  authToken: SENTRY_AUTH_TOKEN,
                  org: SENTRY_ORG,
                  project: SENTRY_PROJECT
                })
              ],
            };
        }
      }
    },
    () => {
      return {
        name: 'pdfjs-copy-dependencies',
        configureWebpack(config, isServer, {currentBundler}) {
          const Plugin = getCopyPlugin(currentBundler);
          return {
            resolve: {
              alias: {
                canvas: false
              }
            },
            plugins: [
              new Plugin({
                patterns: [
                  {
                    from: cMapsDir,
                    to: 'cmaps/'
                  }
                ]
              })
            ]
          };
        }
      }
    },
    () => {
      return {
        name: 'excalidraw-config',
        configureWebpack(config, isServer, {currentBundler}) {
          return {
            module: {
              rules: [
                {
                  test: /\.excalidraw$/,
                  type: 'json',
                },
                {
                  test: /\.excalidrawlib$/,
                  type: 'json',
                }
              ],
            },
            resolve: {
              fallback: {
                'roughjs/bin/math': path.resolve(__dirname, './node_modules/roughjs/bin/math.js'),
                'roughjs/bin/rough': path.resolve(__dirname, './node_modules/roughjs/bin/rough.js'),
                'roughjs/bin/generator': path.resolve(__dirname, './node_modules/roughjs/bin/generator.js')
              }
            },
            plugins: [
              new currentBundler.instance.DefinePlugin({
                'process.env.IS_PREACT': JSON.stringify('false')
              }),
            ]
          }
        }
      }
    },
  ],
  markdown: {
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      if (process.env.NODE_ENV === 'production') {
        return result;
      }
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
  scripts: [
    {
      src: 'https://brr-umami.gbsl.website/script.js',
      ['data-website-id']: process.env.UMAMI_ID,
      ['data-domains']: 'gbsl.silasberger.ch',
      async: true,
      defer: true
    }
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
    "@docusaurus/theme-mermaid",
    [
      themeCodeEditor,
      {
        brythonSrc: 'https://cdn.jsdelivr.net/npm/brython@3.13.0/brython.min.js',
        brythonStdlibSrc: 'https://cdn.jsdelivr.net/npm/brython@3.13.0/brython_stdlib.js',
        libDir: 'https://silasberger.github.io/bry-libs/'
      }
    ]
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: siteConfig.pageTitle,
      logo: {
        alt: `Logo ${siteConfig.pageTitle}`,
        src: 'img/logo.svg',
      },
      items: siteConfig.navbarItems.filter(item => !!item), // Some items may be null.
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'forest'},
    },
    footer: siteConfig.footer,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: "Z6FIZQ5MSD",
      apiKey: "7152c9a398beb4325de68df4f6a62acd",
      indexName: "gbsl-silasberger",
      searchPagePath: 'search',
    }
  } satisfies Preset.ThemeConfig,
};

console.log(`🚀 Building for APP_URL ${config.customFields.APP_URL} with NO_AUTH=${config.customFields.NO_AUTH}`);

export default config;
