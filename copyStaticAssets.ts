import * as shell from "shelljs";

// shell.cp("-R", "src/public/fonts", "dist/public/");
shell.mkdir("-p", "dist/public/");
shell.mkdir("-p", "dist/public/js/vendor");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("node_modules/jquery/dist/jquery.min.js", "dist/public/js/vendor/");
shell.cp("node_modules/d3/dist/d3.min.js", "dist/public/js/vendor/");
