# Website
My teaching website, built with [Docusaurus 2](https://docusaurus.io/).

## Installation
- `yarn install`: Install dependencies
- `yarn run start`: Start the dev server 
- `yarn build`: Generate static content into the `build` directory

## Deployment
Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## About the plugin-content-material
- Run `yarn link` in the `docusaurus-plugin-content-material` repo
- Run `yarn link "plugin-content-material"` in this repo

To unlink, run `yarn unlink "plugin-content-material"`.
