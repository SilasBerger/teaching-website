import {SiteProperties} from "../../src/builder/models/site-config";

const navbarItems = [];

const footer = {
  style: 'dark',
  links: [],
  copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger 
              </a>`,
};

export const draftsSiteProperties: SiteProperties = {
  pagesRoot: 'content/sites/drafts',
  scriptsConfigsFile: 'drafts.scriptsConfigs.json',
  navbarItems: navbarItems,
  pageTitle: 'Drafts',
  tagline: 'Drafts',
  pageBaseUrl: 'https://drafts.silasberger.ch',
  footer: footer,
};
