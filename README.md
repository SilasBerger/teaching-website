# Website
My teaching website, built with [Docusaurus](https://docusaurus.io/).

## Install and build
- `yarn install`: Install dependencies.
- `SITE=teach yarn run start`: Start the dev server for the `teach` site.
- `SITE=teach yarn build`: Create a release build for the `teach` site.

For more examples, check out the CI workflows in `.github`.

## General configuration
### Environment variables
- `SITE`: Which site should be built; must correspond to an entry in `config/siteProperties/site-properties.ts`.
- `LOG_LEVEL`: Only applicable during build stage; 1=`WARN`, 2=`INFO`, 3=`DEBUG`.

### Config files
- `config/builder-config.ts`: Set global material and script root directories.
- `config/siteProperties/<site>.site-properties.ts`: Define general properties and global elements for `<site>`.
- `config/siteProperties/site-properties.ts`: Collect all `<site>.site-properties` definitions.
- `config/sidebars/<site>.sidebars.ts`: Define the sidebar configuration for `<site>`.
- `config/scriptsConfigs/<site>.scriptsConfigs.json`: Define the scripts configurations for `<site>`.

### Examples: Common configuration workflows
#### Configuring a new site called `mySite`
- Create a scripts configs file `config/scriptsConfigs/mySite.scriptsConfigs.json`.
- Create a sidebar file `config/sidebars/mySite.sidebars.ts` with one entry for each script defined in `mySite.scriptsConfigs.json`.
- Create a site properties file `config/siteProperties/mySite.site-properties.ts`.
- Add an entry for `mySite` in `config/siteProperties/site-properties.ts`.
- Create a directory `content/sites/mySite`.
- If required: Add the new site to the deployment pipeline's matrix definition.

#### Configuring a new script `someScript` for a site `mySite`
- Add a script config object `"someScript": {markers: {}, mappings: []}` to `config/scriptsConfigs/mySite.scriptsConfigs.json`.
- Define markers and mappings as needed.
- Add an entry for `someScript` to `config/sidebars/mySite.sidebars.ts`.
- Make sure to include a mapping with `{"section": "/index.md", ...}` to have a proper entry page for the script.

**Warning:** Make sure that the URL paths for pages and scrips do not collide! Examples:
- Page path `/greetings/index.md` and script root `/greetings/hello-in-10-languages` (from a script definition
  `"greetings/hello-in-10-languages": {...}`): Okay, no collision.
- Page path `/greetings/hello-in-10-languages/index.md` and script root `/greetings/hello-in-10-languages`: Problematic!

## Content configuration
### Pages
- `SiteProperties#pagesRoot` in `config/siteProperties/<site>.site-properties.ts` -> served at `/`.

### Scripts
- `builder-config.ts#MATERIAL_ROOT`
- `builder-config.ts#SCRIPTS_ROOT`

#### Scripts configs
```json
{
  "default": {
    "markers": {
      "draft": 0
    },
    "mappings": [
      {"section": "/index.md", "material": "/ScriptLandingPages/wip.md"}
    ]
  }
}
```

#### Filename-based configuration (markers)
TBD

### When pages and scripts overlap...
TBD

## Concepts: Material, sites, pages, scripts, and the sync mechanism
### Material
The material library is a central collection of sections and articles in the form of Markdown files. For every site,
these sections and articles are selectively assembled into individual scripts as needed. The root directory for the
material library is defined by `builder-config.ts#MATERIAL_ROOT`.

### Sites
A site represents...
- from a technical point of view: a unique build target.
- from the website creator's point of view: a specific deployment configuration, defined by its unique collection of
  pages and scripts.
- from the website user's point of view: a unique website.

A site is defined by a set of configuration files and entries as described in the [General configuration](#general-configuration)
section.

### Pages
The [Docusaurus pages plugin](https://docusaurus.io/docs/creating-pages) is used to create on-off standalone pages.
These are individual Markdown files that are not part of any particular script. Pages can for instance be used to create
landing pages or entrypoints for navigating to scripts.

Each site defines a pages root directory in its `config/siteProperties/<site>.site-properties.ts` configuration file.
The contents of that directory are served at `/`. Looking at the following folder structure:

```
content
  pages
    mysite
      index.md (<- page)
      greetings
        hello-world.md (<- page)
```

Assuming that we are building the site `mysite`, and that the `pagesRoot` for `mysite` is set to `content/pages/mysite`.
We would then see the resulting HTML files for our markdown file served as follows:
- for `index.md`: `/` and `/index.html`
- for `hello-world.md`: `/greetings/hello-world` and `/greetings/hello-world.html`

### Scripts
A script is a unique collection of elements from the material library. It is defined by an entry in the site's
`*.scriptsConfigs.json` file. The contents of the script are arranged via mapping entries in that scripts config entry,
as well as through matching markers between the scripts config and filenames in the material library.

When building the respective site, each script definition yields a [docs root](https://docusaurus.io/docs/advanced/routing)
for the [Docusaurus Docs plugin](https://docusaurus.io/docs/docs-introduction). On that site, that docs root is served
at `/<scriptId>`.

### The sync mechanism
The sync mechanism is used to assemble contents from the material library into each individual script, as defined by 
that scripts configuration in the site's `*.scriptsConfigs.json` file and any applicable markers in the material
filenames. `docusaurus.config.ts` marks the entrypoint into the build and sync process.

## Good to know
- Directories with unmatched markers do not prevent their children with matched markers from being used as source
  candidates. For example: If a script has a marker `[foo]`, it will ignore a directory such as `Some-Topic.[bar]`
  per-se. However, it will nevertheless discover and include its `foo`-marked children, such as
  `Some-Topic.[bar]/A-Sub-Topic.[foo]/*` or `Some-Topic.[bar]/an-article.[foo].mdx`
- File or directory names with an empty marker list (e.g. `some-article.[].md`, `Some-Topic.[]`) are still considered
  marked, even though they will not match any applicable markers. This behavior can be used to "mark" a file or
  directory as an unpublished draft.
- When working on a page that should not (yet) be mapped into any scripts (e.g. a placeholder page while developing
  a new component), it is recommended to use the `drafts` site as a drafting and development playground. Either
  add an explicit mapping to `drafts.scriptsConfigs.json`, or mark a file or directory with `draft` (or any other)
  draft-specific marker defined in `drafts.scriptsConfigs.json`), e.g. `Path/To/Some/future-article.[draft].md`. Since
  marked elements are discovered even when nested in a non-marked path, that file (and its parent hierarchy) will
  be included in any draft script with marker `draft`.

