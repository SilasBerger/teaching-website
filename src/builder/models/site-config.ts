// TODO: This should not be in the source code, since it depends on an outside configuration...
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
