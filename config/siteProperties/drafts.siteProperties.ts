import {SiteProperties} from "../../framework/builder/models/siteConfig";
import {Github} from "./util/sharedNavbarItems";
import {NavbarItem} from "@docusaurus/theme-common";

const navbarItems: NavbarItem[] = [
  Github,
];

const footer = {
  style: 'dark',
  links: [],
  copyright: `<a class="footer__link-item" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de">
                    <img src="/img/by-nc-sa.eu.svg" alt="CC-BY-NC-SA">Silas Berger</a> | Ausnahmen sind gekennzeichnet.`,
};

export const draftsSiteProperties: SiteProperties = {
  pagesRoot: 'src/pages/sites/drafts',
  scriptsConfigsFile: 'drafts.scriptsConfigs.yaml',
  navbarItems: navbarItems,
  pageTitle: 'Drafts',
  tagline: 'Drafts',
  pageBaseUrl: 'https://drafts.silasberger.ch',
  footer: footer,
};
