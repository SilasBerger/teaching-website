import * as process from "process";
import { SiteConfig, SiteProperties } from "./models/siteConfig";
import {siteProperties} from "../../config/siteProperties/siteProperties";

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

export function loadConfigForActiveSite(): SiteConfig {
  const site = identifySite();
  return {
    siteId: site,
    properties: getSitePropertiesFor(site)
  }
}
