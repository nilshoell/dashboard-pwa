# Dashboard-PWA

A Progressive Web App to create mobile dashboards using D3js.

## Installation

Make sure you have current versions of [`nodejs`](https://nodejs.org/en/) (`^14.16.0 LTS` or `^15.13.0` recommended) and `npm` (`^7.6.0`) installed.

Then, clone the repository from `git@github.com:nilshoell/dashboard-pwa.git` onto your machine, change into the directory and execute `npm install` to download the dependencies.
### Development

For the first launch please execute `npm run init`. This will compile the SCSS and run `npm run watch`, which in turn starts the TypeScript compilation, start the node server and watchers, and will launch the application in your browser on [`localhost:1337`](http://localhost:1337).\
Since we have `browser-sync` set up, any changes you make to the templates, TypeScript or SCSS will automatically propagate to all browsers with the application opened.

On further starts it is sufficient to run `npm run watch` directly.

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
| TypeScript | Typed JavaScript         | `4.2.3`    | https://www.typescriptlang.org/ |