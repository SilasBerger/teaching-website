# classrooms.app
My teaching website, built on the basis of the [teaching-dev](https://github.com/GBSL-Informatik/teaching-dev) project. Visit at [classrooms.app](https://classrooms.app/).

## Quickstart
First, make sure you have [nvm](https://github.com/nvm-sh/nvm) installed. Clone this repository, `cd` into it and run `nvm use`. Then, run `yarn install`.

Now, create a `.env` file with the following contents:

```conf
OFFLINE_API=true
```

**Temporary workaround required:** This repository depends on a private submodule for non-public docs files. As a workaround, run the following command:

`git rm docs/material/tw-confidential-material`.

Finally, run `yarn run start:sync` and visit `http://localhost:3000`.

### Important files and directories
_Check https://github.com/SilasBerger/teaching-website for inspiration._
- `siteConfig.ts`: Configure your website (title, navbar, footer, etc.).
- `docs/material`: This is where you keep all your teaching materials.
- `scriptsConfig.yaml`: Here, you distribute your teaching materials to your classes. **Important:** Scripts are only updated when re-running `yarn start:sync`.
- `src`: This directory is managed by `teaching-dev` – do **NOT** edit.
- `website`: The site's custom "src"-type folder for custom components, etc. (not managed by `teaching-dev`). For instance, to integrate components from other sites (e.g. https://github.com/SilasBerger/teaching-website/tree/main/website/components), place them in `website/components`.

## Next steps
### Customizing the site config 
The [teaching-dev](https://github.com/GBSL-Informatik/teaching-dev) core is responsible for managing the Docusaurus config and is committed to provide sane defaults. However, users will want to customize these settings.

The `siteConfig.ts` file is the primary way to customize and override these defaults.

**Note:** Changes to `siteConfig.ts` only take effect after restarting the dev server (run `yarn start:sync` again).

A good place to start is the returned object literal:

```ts
return {
  title: '...',
  tagline: '...',
  url: '...',
  // ...
}
```

The following values should likely be among the first ones to be changed:
- `title`
- `url`
- `themeConfig.algolia`: Required for the Algolia full text search API; remove this node or replace with your own API values.
- `scripts`: Remove or customize the Umami config entry.
- `gitHub`: Remove or replace with `orgName: <MyGitHubUsername>` / `projectName: <MyProjectName>` (where `MyProjectName` is the name of your fork / clone of this repo).

In the `transformers` node, the following block is a workaround that is required because some web hosts (namely, Infomaniak) block the delivery of `.py` files (which are required when running Python code on the website):

```ts
// This transformer replaces the default source path for the Brython libs to a GitHub Pages page because some web hosts refuse to deliver .py files.
themes: (themes: any[]) => {
    const codeEditorTheme = themes.find((theme) => !!theme[1].brythonSrc);
    codeEditorTheme[1].libDir = 'https://silasberger.github.io/bry-libs/';
    return themes;
}
```

If the application is to be deployed to GitHub Pages, this block is most likely not required and can be removed.

### Preparing for a class (and learning some core concepts)
This application manages teaching materials along three core concepts:
- `material`
  - The `/docs/material` directory contains (more or less) the entire stock of teaching materials available in this application.
  - Docs are a [core concept of Docusaurus](https://docusaurus.io/docs/docs-introduction). In a nutshell: The `/docs` directory contains a collection of `.mdx` (and some `.tsx`) pages that are transformed to React pages at build time.
  - In terms of this application, `/docs/material` is where you keep all your teaching materials.
- `scripts`
  - Conceptually, a `script` is an organized (i.e. ordered) collection of teaching materials (i.e. elements in `/docs/material`) for a particular learning group (generally, a class).
  - From a technical point of view, a `script` is a top-level entry in the `scriptsConfig.yaml` file that contains mappings from the `/docs/material` directory to a special docs directory for that learning group. A sync mechanism ensures that the core teaching materials are correctly distributed to the scripts defined in `scriptsConfig.yaml` when running `yarn start:sync` or `yarn build`. This process outputs to the `/build` directory, so the results are not tracked by `git` and are regenerated on every build / deployment. This allows you to curate your teaching materials in a central place and distribute them to your different classes as needed.
  - Each defined script is available under `/<scriptName>`. If you have configured your `scriptsConfig.yaml` as outlined in the [Quickstart](#quickstart) section, you should now be available to access your `demo` script under http://localhost:3000/demo/Erste-Hilfe (note that this script doesn't contain an `index.mdx` page, so <s>http://localhost:3000/demo</s> will give you a `404` error – more on that later).
- `pages`: TODO.

TODO: Adding a script. Adding an index page. Changing the landing page.

### Customizing content
TODO:
- Changing a doc.
- Adding a doc / topic

### Deploying the local API
TODO: Deploying the dev API and connecting the frontend to that.

### Deployment
TODO: Deploy with GitHub Pages or to a webhost.

## Environment variables
_Additional environment variables may be available; see https://github.com/GBSL-Informatik/teaching-dev?tab=readme-ov-file#env._
| Variable                   | For         | Default                 | Example                          | Description                                                                                                                                                        |
| :------------------------- | :---------- | :---------------------- | :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`                  | Production  | `http://localhost:3000` |                                  | Domain of the hosted app                                                                                                                                           |
| `BACKEND_URL`              | Production  | `http://localhost:3002` |                                  | Url of the API Endpoint                                                                                                                                            |
| `CLIENT_ID`                | Production  |                         |                                  | Azure ID: Client ID                                                                                                                                                |
| `TENANT_ID`                | Production  |                         |                                  | Azure AD: Tenant Id                                                                                                                                                |
| `API_URI`                  | Production  |                         |                                  | Azure AD: API Url                                                                                                                                                  |
| `STUDENT_USERNAME_PATTERN` | Production  |                         | `@edu`                           | Users with usernames matching this RegExp pattern are displayed as students (regardless of admin status). If unset, all non-admin users are displayed as students. |
| `TEST_USERNAMES`           | Development |                         | `admin.bar@bazz.ch;test@user.ch` | To log in offline. First user is selected as default. Must all correspond to a user emails found in the API's database.\*                                          |
| `SENTRY_DSN`               | Production  |                         |                                  | Sentry DSN for error tracking                                                                                                                                      |
| `SENTRY_AUTH_TOKEN`        | Production  |                         |                                  | Sentry Auth Token for error tracking                                                                                                                               |
| `SENTRY_ORG`               | Production  |                         |                                  | Sentry Org for error tracking                                                                                                                                      |
| `SENTRY_PROJECT`           | Production  |                         |                                  | Sentry Project for error tracking                                                                                                                                  |
| `SITE`                     | Production  |                         | `gbsl`                           | Which site should be built; must correspond to an entry in `config/siteProperties/siteProperties.ts`.                                                              |
| `LOG_LEVEL`                | Production  | 2                       |                                  | 1=`WARN`, 2=`INFO`, 3=`DEBUG`                                                                                                                                      |