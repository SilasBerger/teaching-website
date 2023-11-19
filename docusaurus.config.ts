import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {Branding} from "./branding";

const BASE_URL = '/';
const OFFLINE_MODE = process.env.OFFLINE_MODE || false;

const config: Config = {
  title: Branding.pageTitle,
  tagline: Branding.tagline,
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: Branding.pageBaseUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SilasBerger', // Usually your GitHub org/user name.
  projectName: 'teaching-website', // Usually your repo name.

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
        docs: {
          path: 'content/material/master',
          routeBasePath: 'material',
          sidebarPath: './config/sidebars/sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: Branding.pageTitle,
      logo: {
        alt: `Logo ${Branding.pageTitle}`,
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'materialSidebar',
          position: 'left',
          label: 'Material',
        },
        {
          type: 'docSidebar',
          sidebarId: 'g26cSidebar',
          position: 'left',
          label: 'G26c',
        },
        {
          href: Branding.githubLink,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tools',
          items: [
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
          title: 'Links',
          items: [
            {
              label: 'Troubleshooting Office 365',
              to: '/troubleshooting',
            },
            {
              label: 'Jupyterhub',
              to: 'https://jupyter.gbsl.website',
            }
          ],
        },
        {
          title: 'Gymnasium',
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
          ],
        }
      ],
      copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                    <img src="${BASE_URL}img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger 
                  </a>
                  <br/>
                  <span>
                    Mit Material von
                    <a href="https://ofi.gbsl.website/">Balthasar Hofer</a> •
                    <a href="https://craft.rothe.io/">Stefan Rothe</a> •
                    <a href="https://oinf.ch/">oinf.ch</a>
                  </span>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
