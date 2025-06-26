# Old setup instructions
## Usage and configuration
### Basic dev setup
**Part 1: Set up the [`teaching-api`](https://github.com/GBSL-Informatik/teaching-api):**\
_This setup guide assumes you have Docker installed on your dev device. For alternative setup instructions, see the [`teaching-api`](https://github.com/GBSL-Informatik/teaching-api) repository._

1. Run `cp .env.example .env` and populate `.env` with your custom values (see [here](https://github.com/GBSL-Informatik/teaching-api?tab=readme-ov-file#environment-variables) for documentation on environment vars).
2. In `.env`, set `NO_AUTH=true` to enable local dev login without MSAL authentication.
3. To start with a fresh database image, run `scripts/purge_dev_services.sh`
4. Run `dev_services.compose.yml` to launch the dev database in Docker.
5. Run `yarn install`.
6. Run `yarn run db:migrate` to apply all pending migrations to the `teaching_api` dev database.
7. Run `yarn run db:seed`.
8. Make a user `ADMIN` in the dev database: Connect to the dev database (`docker container exec -it teaching-api-postgres-1 psql -U postgres`, then `\c teaching_api`) and run `UPDATE users SET role='ADMIN' WHERE email='test@user.ch';`.
9. Run `yarn run dev` to launch the API.

**Part 2: Set up [`teaching-website`](https://github.com/SilasBerger/teaching-website) (i.e. this frontend repository):**
1. Run `cp .env.example .env` and populate `.env` with your custom values (see [here](#environment-variables) for documentation on environment vars).
2. To work with local dev login (`NO_AUTH=true` in the API `.env` config), set `TEST_USERNAMES="test@user.ch"` or `TEST_USERNAMES="test@user.ch;foo@bar.ch"`. All users specified here must exist in the database, or they can't log in.
3. Run `yarn install`.
4.  Run `SITE=gbsl yarn start` and visit http://localhost:3000/. A good place to start exploring the available components and features is the [Component gallery](http://localhost:3000/docs/material/Components-Gallery/Shared-Components).

### Environment variables
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

## Deployment
Some legacy sites may still be available in the codebase (i.e. have a `.siteProperties.ts`-file, etc.) but are no longer included in the deployment build matrix and are hence no longer being deployed on push. Currently, this is the case for the `lerbermatt` and `teach` site.

**Note:** The _sites_ concept is scheduled for removal. This will come with notable changes to the current config files setup (such as `.siteProperties.ts`), as well as to the build infrastrucutre.

The `build_and_deploy_sites` task in `check_build_deploy.yml` currently specifies the following environment:

```yml
environment: deploy_${{ matrix.site }}
```

From that, the runner automatically created an environment named `deploy_${{ matrix.site }}` on the first run with this config. Note that legacy environments (i.e. environments for sites which are no longer in the build matrix) will not be automatically removed. Environments can be modified [here](https://github.com/SilasBerger/teaching-website/settings/environments). 

The secrets within these environments are available in the `secrets` context to use within the workflow spec. They must be explicitly included and specified as environment variables for the respective jobs, e.g.

```yml
steps:
    run: SITE=${{ matrix.site }} yarn run build
    env:
      CLIENT_ID: ${{ secrets.CLIENT_ID }}
      TENANT_ID: ${{ secrets.TENANT_ID }}
      APP_URL: ${{ secrets.APP_URL }}
      BACKEND_URL: ${{ secrets.BACKEND_URL }}
      API_URI: ${{ secrets.API_URI }}
```

If a field `FOO` is added as a variable, rather than a secret, it is instead available in the `vars` context: `${{ vars.FOO }}}`. 

If an environment for a particular site does not provide a given secret or variable, that value (and hence, the environment variable) will be undefined. If, at some point, we need a different login strategy for another site (e.g. username / password for `teach`), we would add additional environment variables / secrets to the workflow config, define the required secrets in the corresponding environment (in this example, the ones for username / pw in `teach`), and make sure that the build process can handle one "set" being undefined (the MSAL one for `teach` and the username / pw one for `gbsl`).
