# Dashboard-PWA

A Progressive Web App that explores the possibilities of mobile dashboards utilizing D3.js for the visualizations.

- [Dashboard-PWA](#dashboard-pwa)
  - [Introduction](#introduction)
  - [Installation](#installation)
    - [Development](#development)
    - [Production](#production)
  - [Dependencies](#dependencies)
  - [Repository Structure](#repository-structure)


## Introduction

This Node application is part of my master thesis about mobile dashboards and serves as a technical demonstration and implementation of requirements derived from the research.
The full thesis is available [here](thesis.pdf) under the [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/) license.

**Note:** This app is _only_ optimized for mobile devices such as smartphones, and will probably look awful on anything bigger than 8".

## Installation

Make sure you have current versions of [`nodejs`](https://nodejs.org/en/) (`^16.11.0 LTS` or recommended) and `npm` (`^8.1.0`) installed.

Then, clone the repository from `git@github.com:nilshoell/dashboard-pwa.git` onto your machine (or download and unpack the [zip-file](https://github.com/nilshoell/dashboard-pwa/archive/refs/heads/main.zip)), change into the directory and execute `npm install` to download the dependencies.

### Development

Simply run `npm run watch` inside the projects folder, which in turn starts the TypeScript compilation, the node server and watchers, and will launch the application in your browser on [`localhost:1337`](http://localhost:1337).\
Since we have `browser-sync` set up, any changes you make to the templates, TypeScript or SCSS will automatically propagate to all browsers with the application opened.

### Production

We recommend deleting any existing `dist` folder before starting the build process for a clean setup, then run `npm run build` from the project directory.
Afterwards you can copy the new `dist` folder to wherever your web root should be, and run `node dist/server.js` to start the server.

For a **Docker Installation** create a new docker image using `docker build -t dashboard-pwa .` from the projects root directory. Afterwards run `docker run -it -p 32001:3000 dashboard-pwa` to make the PWA available on `localhost:32001`, or make use of the supplied `docker-compose.yml` and run `docker-compose up`.

To further simplify this process you can define an alias such as `alias dashboard-rebuild='sudo docker-compose down && git pull && sudo docker build -t dashboard-pwa . && sudo docker-compose up -d'` to incorporate changes from the git repository into the production application.

## Dependencies

This application is build on top of a couple of other technologies, most notably:

| Dependency | Description              | Version (npm) | Documentation                   |
|------------|--------------------------|---------------|---------------------------------|
| Node.js    | JavaScript Runtime       | `v16.13.0 LTS`| https://nodejs.org/en/          |
| D3.js      | Visualization Engine     | `6.7.0`       | https://d3js.org/               |
| pug        | Templating Engine        | `3.0.2`       | https://pugjs.org/              |
| jQuery     | DOM Manipulation Library | `3.6.0`       | https://jquery.com/             |
| Bootstrap  | CSS Framework            | `4.6.0`       | https://getbootstrap.com/       |
| SQLite     | Database                 | `5.0.2`       | https://sqlite.org/index.html   |
| TypeScript | Typed JavaScript         | `4.2.4`       | https://www.typescriptlang.org/ |


## Repository Structure

| Path          | Description                                                       |
|---------------|-------------------------------------------------------------------|
| `src`         | All application assets                                            |
| `src/db`      | SQL files to set up and fill the test database                    |
| `src/public`  | Client assets such as chart definitions, TS/CSS and images        |
| `src/routers` | Server-site routers for the application and API                   |
| `ts`          | TypeScript compiler setup                                         |
| `views`       | Pug template files                                                |