// This file is never changed by teaching-dev.
// Use it to override or extend your app configuration.

import { VersionOptions } from '@docusaurus/plugin-content-docs';
import { SiteConfig, SiteConfigProvider } from '@tdev/siteConfig/siteConfig';
import {
  DevComponentGalleryNavbarItem,
  DevDevDocsNavbarItem,
  DevDocsNavbarItem,
  DevDraftNavbarItem,
} from "./navbarItems";
import {
  taskStateOverview,
  accountSwitcher,
  requestTarget,
  loginProfileButton,
} from './src/siteConfig/navbarItems';
import { ScriptsBuilder } from './framework/builder/scriptsBuilder';
import { remarkContainerDirectivesConfig } from "./website/plugin-configs/remark-container-directives/plugin-config";
import { remarkLineDirectivesPluginConfig } from "./website/plugin-configs/remark-line-directives/plugin-config";
import remarkContainerDirectives from "./website/plugins/remark-container-directives/plugin";
import remarkLineDirectives from "./website/plugins/remark-line-directives/plugin";
import kbdPlugin from "./src/plugins/remark-kbd/plugin";
import mdiPlugin from "./src/plugins/remark-mdi/plugin";
import linkAnnotationPlugin from './src/plugins/remark-link-annotation/plugin';
import strongPlugin from "./src/plugins/remark-strong/plugin";
import pagePlugin from './src/plugins/remark-page/plugin';
import mediaPlugin from "./src/plugins/remark-media/plugin";
import pdfPlugin from './src/plugins/remark-pdf/plugin';
import commentPlugin from './src/plugins/remark-comments/plugin';
import enumerateAnswersPlugin from "./src/plugins/remark-enumerate-components/plugin";
import remarkMath from "remark-math";

/*
TODO: Ideally, we should just be able to take the default plugins here. However, we currently use custom plugin managers to register new admonition types.
If these plugins run after the commentPlugin, this leads to an mdxComment element being inserted as the first element in the admonition content, which, in
turn, prevents the application of the CSS class that replaces the admonition icon with the task state checkbox.
- Step 1: Once the config improvements are available, assemble this list from exported plugin configs instead.
- Step 2: Get rid of custom plugin managers and register custom adminitions the way teaching-dev does.
*/
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

const getSiteConfig: SiteConfigProvider = () => {

  const SCRIPTS_CONFIG_FILE = 'scriptsConfig.yaml';

  const versions: { [key: string]: VersionOptions } = {
    'current': {
      badge: false,
      banner: 'none',
      path: 'docs',
    },
  };

  ScriptsBuilder.readScriptNames(SCRIPTS_CONFIG_FILE).forEach((scriptName: string) => {
    versions[scriptName] = {
      badge: false,
      banner: 'none',
    };
  });

  process.env.NODE_ENV === 'development'
    ? ScriptsBuilder.watch(SCRIPTS_CONFIG_FILE)
    : ScriptsBuilder.buildOnce(SCRIPTS_CONFIG_FILE);

  return {
    title: 'Unterricht S. Berger',
    tagline: 'Informatik',
    url: 'https://gbsl.silasberger.ch',
    siteStyles: ['website/css/custom.scss'],
    navbarItems: [
      taskStateOverview,
      DevDocsNavbarItem,
      DevDraftNavbarItem,
      DevComponentGalleryNavbarItem,
      DevDevDocsNavbarItem,
      accountSwitcher,
      requestTarget,
      loginProfileButton,
    ].filter(item => !!item),
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tools',
          items: [
            {
              label: 'Thonny',
              to: 'https://thonny.org/'
            },
            {
              label: 'VS Code',
              to: 'https://code.visualstudio.com/'
            },
            {
              label: 'Python',
              to: 'https://www.python.org/'
            }
          ]
        },
        {
          title: 'Meine Schule',
          items: [
            {
              label: 'Passwort Zurücksetzen',
              to: 'https://password.edubern.ch/'
            },
            {
              label: 'Office 365',
              to: 'https://office.com',
            },
            {
              label: 'GBSL',
              to: 'https://gbsl.ch',
            },
            {
              label: 'Intranet',
              to: 'https://erzbe.sharepoint.com/sites/GYMB/gbs'
            },
            {
              label: 'Stundenplan',
              to: 'https://mese.webuntis.com/WebUntis/?school=gym_Biel-Bienne#/basic/main',
            },
            {
              label: '🧑🏽‍💻 Anleitungen BYOD / ICT',
              to: 'https://ict.gbsl.website/'
            },
            {
              label: '⛑️ IT-Support für Schüler*innen',
              to: 'mailto:it-help-for-students@bernedu.ch',
            }
          ],
        }
      ],
      copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                          <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger</a> | Ausnahmen sind gekennzeichnet.`,
    },
    transformers: {
      'themeConfig.algolia': (_) => ({ // TODO: Suggest algolia config field.
        appId: "Z6FIZQ5MSD",
        apiKey: "7152c9a398beb4325de68df4f6a62acd",
        indexName: "gbsl-silasberger",
        searchPagePath: 'search',
      }),
      'onBrokenLinks': (_) => 'warn',
      'presets': (presets => {
        const presetClassic = presets.find(preset => preset[0] === 'classic'); // TODO: Suggest preset transformers, and versions config field.
        const presetConfig = presetClassic[1];

        const docsConfig = presetConfig.docs;
        docsConfig.lastVersion = 'current';
        docsConfig.routeBasePath = '',
        docsConfig.versions = versions;
        docsConfig.remarkPlugins = REMARK_PLUGINS;

        const pagesConfig = presetConfig.pages;
        pagesConfig.remarkPlugins = REMARK_PLUGINS;

        return presets
      }),
      'themes': (themes) => {
        const codeEditorTheme = themes.find(theme => !!theme[1].brythonSrc);
        codeEditorTheme[1].libDir = 'https://silasberger.github.io/bry-libs/';
        return themes;
      }
    },
  } as SiteConfig;
};

export default getSiteConfig;
