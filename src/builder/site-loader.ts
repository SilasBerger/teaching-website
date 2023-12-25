import * as process from "process";
import { SiteConfig, SiteProperties } from "./models/site-config";
import {siteProperties} from "../../config/siteProperties/site-properties";

function getSitePropertiesFor(site: string): SiteProperties {
  return siteProperties[site];
}

function identifySite() {
  const availableSites = Object.keys(siteProperties);
  const siteEnvVar = process.env.SITE;
  if (!siteEnvVar) {
    throw `Required environment variable 'SITE' is not defined. Possible values are: ${availableSites}`;
  }

  const site = availableSites.find(siteId => siteEnvVar == siteId);
  if (!site) {
    throw `No such site '${siteEnvVar}'. Possible values for SITE environment variable are ${availableSites}`;
  }

  return site;
}

export function loadSiteConfig(): SiteConfig {
  const site = identifySite();
  return {
    siteId: site,
    properties: getSitePropertiesFor(site)
  }
}
