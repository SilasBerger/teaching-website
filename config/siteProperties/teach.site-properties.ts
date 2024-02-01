import {SiteProperties} from "../../src/framework/builder/models/site-config";

const navbarItems = [
  {to: 'gymnasium/informatik', label: 'Gymnasium', position: 'left'},
  {to: 'sekundarstufe/medien-und-informatik', label: 'Sekundarstufe', position: 'left'},
  {to: 'primarstufe/medien-und-informatik', label: 'Primarstufe', position: 'left'},
  {to: 'creative-corner', label: '🎨 Creative Corner', position: 'right'},
];

const footer = {
  style: 'dark',
  links: [],
  copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                    <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger</a> | Ausnahmen sind gekennzeichnet.`,
};

export const teachSiteProperties: SiteProperties = {
  pagesRoot: 'content/sites/teach',
  scriptsConfigsFile: 'teach.scriptsConfigs.yaml',
  navbarItems: navbarItems,
  pageTitle: 'Unterrichtsmaterial Silas Berger',
  tagline: 'Unterrichtsmaterial',
  pageBaseUrl: 'https://teach.silasberger.ch',
  footer: footer,
};
