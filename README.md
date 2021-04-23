# Dashboard-PWA

A Progressive Web App that explores the possibilities of mobile dashboards utilizing D3.js for the visualizations.

- [Dashboard-PWA](#dashboard-pwa)
  - [Installation](#installation)
    - [Development](#development)
    - [Production](#production)
  - [Dependencies](#dependencies)

## Installation

Make sure you have current versions of [`nodejs`](https://nodejs.org/en/) (`^14.16.0 LTS` or `^15.13.0` recommended) and `npm` (`^7.6.0`) installed.

Then, clone the repository from `git@github.com:nilshoell/dashboard-pwa.git` onto your machine (or download and unpack the [zip-file](https://github.com/nilshoell/dashboard-pwa/archive/refs/heads/main.zip)), change into the directory and execute `npm install` to download the dependencies.
### Development

Simply run `npm run watch` inside the projects folder, which in turn starts the TypeScript compilation, the node server and watchers, and will launch the application in your browser on [`localhost:1337`](http://localhost:1337).\
Since we have `browser-sync` set up, any changes you make to the templates, TypeScript or SCSS will automatically propagate to all browsers with the application opened.

### Production


## Dependencies

This application is build on top of a couple of other technologies, most notably:

| Dependency | Description              | Version    | Documentation                   |
|------------|--------------------------|------------|---------------------------------|
| Node.js    | JavaScript Runtime       | `v14.16.0` | https://nodejs.org/en/          |
| D3.js      | Visualization Engine     | `6.6.1`    | https://d3js.org/               |
| pug        | Templating Engine        | `3.0.2`    | https://pugjs.org/              |
| jQuery     | DOM Manipulation Library | `3.6.0`    | https://jquery.com/             |
| Bootstrap  | CSS Framework            | `4.6.0`    | https://getbootstrap.com/       |
| SQLite     | Database                 | `5.0.2`    | https://sqlite.org/index.html   |
| TypeScript | Typed JavaScript         | `4.2.3`    | https://www.typescriptlang.org/ |