import {SiteProperties} from "../../framework/builder/models/siteConfig";
import {NavbarItem} from "@docusaurus/theme-common";

const navbarItems: NavbarItem[] = [];

const footer = {
  style: 'dark',
  links: [],
  copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                    <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger</a> | Ausnahmen sind gekennzeichnet.`,
};

export const lerbermattSiteProperties: SiteProperties = {
  pagesRoot: 'src/pages/sites/lerbermatt',
  scriptsConfigsFile: 'lerbermatt.scriptsConfigs.yaml',
  navbarItems: navbarItems,
  pageTitle: 'Informatik S. Berger',
  tagline: 'Informatikunterricht',
  pageBaseUrl: 'https://lerbermatt.silasberger.ch',
  footer: footer,
};
