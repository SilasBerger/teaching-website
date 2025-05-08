// This file is never changed by teaching-dev.
// Use it to override or extend your app configuration.

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

const getSiteConfig: SiteConfigProvider = () => {

  const SCRIPTS_CONFIG_FILE = 'scriptsConfig.yaml';
  // const pagesRoot = 'src/pages';

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
  };
};

export default getSiteConfig;

// TODO: Copy / paste the tdev docusaurus config.
