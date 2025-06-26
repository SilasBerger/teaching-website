# Website
My teaching website, built on the basis of the [teaching-dev](https://github.com/GBSL-Informatik/teaching-dev) project. Visit at [https://gbsl.silasberger.ch/](https://gbsl.silasberger.ch/).

## Quickstart
Clone or fork the [repository](https://github.com/SilasBerger/teaching-website) and run `yarn install`.

Then, create a file `.env` with the following content:

```conf
OFFLINE_API=true
```

Replace the contents of `scriptsConfig.yaml` with the following:

```yaml
---
demo:
    markers:
        demo: 0
    mappings:
        - section: 01-Erste-Hilfe
          material: Erste-Hilfe
```

**Temporary workaround required:** This repository depends on a private submodule for non-public docs files. As a workaround, run the following command:

`git rm docs/material/tw-confidential-material`.

Finally, run `yarn start:sync`. Now you can visit http://localhost:3000/ to see the landing page. Once on the website, click the **Material** button to see all available docs (i.e. all the teaching material).

## Next steps
### Customizing the site config 
TODO: Changing title, footer, nav items, etc.

### Preparing for a class
TODO: Adding a script and changing the landing page.

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