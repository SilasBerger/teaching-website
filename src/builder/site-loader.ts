import * as process from "process";
import { Site, SiteConfig, SiteProperties } from "./models/site-config";
import {lerbermattSiteProperties} from "../../config/siteProperties/lerbermatt.site-properties";
import {gbslSiteProperties} from "../../config/siteProperties/gbsl.site-properties";
import {teachSiteProperties} from "../../config/siteProperties/teach.site-properties";

function getSitePropertiesFor(site: Site): SiteProperties {
  switch (site) {
    case Site.TEACH:
      return teachSiteProperties;
    case Site.GBSL:
      return gbslSiteProperties;
    case Site.LERBERMATT:
      return lerbermattSiteProperties;
  }

  throw `Unexpected site: ${site}`;
}

function identifySite() {
  return Object.values(Site).find(siteId => process.env.SITE == siteId) ?? Site.TEACH;
}

export function loadSiteConfig(): SiteConfig {
  const site = identifySite();
  return {
    siteId: site,
    properties: getSitePropertiesFor(site)
  }
}
