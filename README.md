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
- Configuring a new site `mySite`
  - Create a scripts configs file `config/scriptsConfigs/mySite.scriptsConfigs.json`
  - Create a sidebar file `config/sidebars/mySite.sidebars.ts` with one entry for each script
  - Create a site properties file `config/siteProperties/mySite.site-properties.ts`
    - add it as an entry `mySite` to `config/siteProperties/site-properties.ts` 
  - Create a directory `content/sites/mySite`
- Configuring a new script `someScript` for a site `mySite`
  - Add the mapping array `"someScript": []` to `config/scriptsConfigs/mySite.scriptsConfigs.json` 
  - Fill the mapping array with material-to-script mappings
  - Add an entry for `someScript` to `config/sidebars/mySite.sidebars.ts`
  - Make sure to include a mapping with `{"section": "/index.md", ...}` to have a proper entry page for the script.

## Misc doc notes
- Directories with unmatched markers do not prevent their children with matched markers from being used as source
  candidates. For example: If a script has a marker `[foo]`, it will ignore a directory such as `Some-Topic.[bar]`
  per-se. However, it will nevertheless include its `foo`-marked children, such as
  `Some-Topic.[bar]/A-Sub-Topic.[foo]/*` or `Some-Topic.[bar]/an-article.[foo].mdx`
- File or directory names with an empty marker list (e.g. `some-article.[].md`, `Some-Topic.[]`) are still considered
  marked, even though they will not match any applicable markers. This behavior can be used to "mark" a file or
  directory as an unpublished draft.
