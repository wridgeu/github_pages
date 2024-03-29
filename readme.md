[![Build SPA & Deployment](https://github.com/wridgeu/github_pages/actions/workflows/build-deploy.yml/badge.svg?branch=master)](https://github.com/wridgeu/github_pages/actions/workflows/build-deploy.yml)
![OpenUI5 logo](http://openui5.org/images/OpenUI5_new_big_side.png)

# Name: "projectpages"

Repository for development purposes only. It is used for development and adding changes to the [main repository](https://github.com/SAPMarco/SAPMarco.github.io). Hosting is done via [Github Pages](https://pages.github.com/). 

## CI/CD

CD is done via GitHub Workflows (Action) which will be triggerd up on changes within the package.json file. It uses the UI5-Tooling to create a built (self-contained) version of the application and deploy the build afterwards. [visit the workflow-file](https://github.com/wridgeu/github_pages/blob/master/.github/workflows/build-deploy.yml).

## Scaffolding

This project scaffolding has been generated with [easy-ui5](https://github.com/SAP)

## Submodules

If you didn't clone recursively including submodules, init the submodule using:

```shell
git submodule update --init
```
