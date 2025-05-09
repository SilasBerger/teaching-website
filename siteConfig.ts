// This file is never changed by teaching-dev.
// Use it to override or extend your app configuration.

import { VersionOptions } from '@docusaurus/plugin-content-docs';
import { SiteConfigProvider } from '@tdev/siteConfig/siteConfig';
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
import {remarkContainerDirectivesConfig} from "./src/plugin-configs/remark-container-directives/plugin-config";
import {remarkLineDirectivesPluginConfig} from "./src/plugin-configs/remark-line-directives/plugin-config";
import remarkContainerDirectives from "./src/plugins/remark-container-directives/plugin";
import remarkLineDirectives from "./src/plugins/remark-line-directives/plugin";

const getSiteConfig: SiteConfigProvider = () => {

  const SCRIPTS_CONFIG_FILE = 'scriptsConfig.yaml';
  // const PAGES_ROOT = 'src/pages';

  const versions: {[key: string]: VersionOptions } = {
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
    navbarItems: [
      taskStateOverview,
      DevDocsNavbarItem,
      DevDraftNavbarItem,
      DevComponentGalleryNavbarItem,
      DevDevDocsNavbarItem,
      accountSwitcher,
      requestTarget,
      loginProfileButton,
    ],
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
      'presets': (presets => { 
        const presetClassic = presets.find(preset => preset[0] === 'classic'); // TODO: Suggest preset transformers, and versions config field.
        const presetConfig = presetClassic[1];

        const docsConfig = presetConfig.docs;
        docsConfig.lastVersion = 'current';
        docsConfig.routeBasePath = '',
        docsConfig.versions = versions;
        docsConfig.remarkPlugins = [
          ...docsConfig.remarkPlugins,
          [remarkContainerDirectives, remarkContainerDirectivesConfig], // TODO: Suggest exposing default plugins, so we can just spread that array and pass an override.
          [remarkLineDirectives, remarkLineDirectivesPluginConfig],
        ];

        const pagesConfig = presetConfig.pages;
        // pagesConfig.path = PAGES_ROOT;
        pagesConfig.remarkPlugins = [
          ...pagesConfig.remarkPlugins,
          [remarkContainerDirectives, remarkContainerDirectivesConfig],
          [remarkLineDirectives, remarkLineDirectivesPluginConfig],
        ];

        return presets
      }),
    },
  };
};

export default getSiteConfig;

// TODO: Copy / paste the tdev docusaurus config.
