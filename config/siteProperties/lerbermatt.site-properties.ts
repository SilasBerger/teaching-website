import {SiteProperties} from "../../src/models/site-config";

const navbarItems = [];

const footer = {
  style: 'dark',
  links: [],
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

export const lerbermattSiteProperties: SiteProperties = {
  pagesRoot: 'content/sites/lerbermatt',
  scriptsConfigsFile: 'lerbermatt.scriptsConfigs.json',
  navbarItems: navbarItems,
  pageTitle: 'Informatik S. Berger',
  tagline: 'Informatikunterricht',
  pageBaseUrl: 'https://lerbermatt.silasberger.ch',
  footer: footer,
};
