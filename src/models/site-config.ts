export enum Site {
  TEACH = 'teach',
  GBSL = 'gbsl',
  LERBERMATT = 'lerbermatt',
}

export interface SiteConfig {
  siteId: string;
  properties: SiteProperties;
}

export interface SiteProperties {
  pagesRoot: string;
  scriptsConfigsFile: string;
  navbarItems: any[];
  pageTitle: string;
  tagline: string;
  pageBaseUrl: string;
  footer: object;
}
