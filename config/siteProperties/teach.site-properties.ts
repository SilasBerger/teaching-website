import {SiteProperties} from "../../src/builder/models/site-config";

const navbarItems = [
  {to: 'gymnasium', label: 'Gymnasium', position: 'left'},
  {to: 'sekundarstufe', label: 'Sekundarstufe', position: 'left'},
  {to: 'primarstufe', label: 'Primarstufe', position: 'left'},
  {to: 'creative-corner', label: '🎨 Creative Corner', position: 'right'},
];

const footer = {
  style: 'dark',
  links: [],
  copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                    <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger 
                  </a>
                  <br/>
                  <span>
                    Mit Dank an:
                    <a href="https://ofi.gbsl.website/">Balthasar Hofer</a> •
                    <a href="https://craft.rothe.io/">Stefan Rothe</a> •
                    <a href="https://oinf.ch/">oinf.ch</a>
                  </span>`,
};

export const teachSiteProperties: SiteProperties = {
  pagesRoot: 'content/sites/teach',
  scriptsConfigsFile: 'teach.scriptsConfigs.json',
  navbarItems: navbarItems,
  pageTitle: 'Unterrichtsmaterial Silas Berger',
  tagline: 'Unterrichtsmaterial',
  pageBaseUrl: 'https://teach.silasberger.ch',
  footer: footer,
};
