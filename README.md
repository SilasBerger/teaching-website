# Website
My teaching website, built with [Docusaurus 2](https://docusaurus.io/).

## Installation
- `yarn install`: Install dependencies
- `yarn run start`: Start the dev server 
- `yarn build`: Generate static content into the `build` directory

## Concepts
- Material (the complete material library)
- Site (a build target and a pages root)
- Script (a sync target and a docs root)

## Configuration
- Configuring a new site
  - For now (this should change soon), create an entry in the enum in `site-config.ts`
  - Create a script config in `config/scriptsConfigs`
  - Create a sidebar in `config/sidebars`
  - Create a site config in `config/siteProperties`
  - Create a dir named after that site in `content/sites`
- Configuring a new script `someScript` for a site `mySite`
  - Add the mapping array `"someScript": []` to `config/scriptsConfigs/mySite.scriptsConfigs.json` 
  - Fill the mapping array with material-to-script mappings
  - Make sure to include a mapping with `{"section": "/index.md", ...}` to have a proper entry page for the script.
