import {SiteProperties} from "../../framework/builder/models/siteConfig";
import {NavbarItem} from "@docusaurus/theme-common";
import {
  AccountSwitcherNavItem, DevComponentGalleryNavbarItem,
  DevDevDocsNavbarItem,
  DevDocsNavbarItem,
  DevDraftNavbarItem,
  LoginProfileNavItem,
  TaskStateOverviewNavItem
} from "./util/sharedNavbarItems";

const navbarItems: NavbarItem[] = [
  TaskStateOverviewNavItem,
  DevDocsNavbarItem,
  DevDraftNavbarItem,
  DevComponentGalleryNavbarItem,
  DevDevDocsNavbarItem,
  AccountSwitcherNavItem,
  LoginProfileNavItem,
];

const footer = {
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
};

export const gbslSiteProperties: SiteProperties = {
  pagesRoot: 'src/pages/sites/gbsl',
  scriptsConfigsFile: 'gbsl.scriptsConfigs.yaml',
  navbarItems: navbarItems,
  pageTitle: 'Unterricht S. Berger',
  tagline: 'Informatik',
  pageBaseUrl: 'https://gbsl.silasberger.ch',
  footer: footer,
};
