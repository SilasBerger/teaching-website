import {NavbarItem} from "@docusaurus/theme-common";

export interface SiteConfig {
  pagesRoot: string;
  scriptsConfigsFile: string;
  navbarItems: NavbarItem[];
  pageTitle: string;
  tagline: string;
  pageBaseUrl: string;
  footer: object;
}
