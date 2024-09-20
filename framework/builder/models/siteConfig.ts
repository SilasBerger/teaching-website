import {NavbarItem} from "@docusaurus/theme-common";

export interface SiteConfig {
  siteId: string;
  properties: SiteProperties;
}

export interface SiteProperties {
  pagesRoot: string;
  scriptsConfigsFile: string;
  navbarItems: NavbarItem[];
  pageTitle: string;
  tagline: string;
  pageBaseUrl: string;
  footer: object;
}
