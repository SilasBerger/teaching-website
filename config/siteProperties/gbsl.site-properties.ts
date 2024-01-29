import {SiteProperties} from "../../src/builder/models/site-config";

const navbarItems = [];

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
                    <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger 
                  </a>
                  <br/>
                  <span>
                    Mit Material von
                    <a href="https://ofi.gbsl.website/">Balthasar Hofer</a> •
                    <a href="https://craft.rothe.io/">Stefan Rothe</a> •
                    <a href="https://oinf.ch/">oinf.ch</a>
                  </span>`,
};

export const gbslSiteProperties: SiteProperties = {
  pagesRoot: 'content/sites/gbsl',
  scriptsConfigsFile: 'gbsl.scriptsConfigs.yaml',
  navbarItems: navbarItems,
  pageTitle: 'Informatik S. Berger',
  tagline: 'Informatikunterricht',
  pageBaseUrl: 'https://gbsl.silasberger.ch',
  footer: footer,
};
