# Errl

Error Reporting Client and API

### Getting Started

To get all the required packages, first open ```.\src\METS.sln``` and restore NuGet packages, then run the following commands in the root folder:

    npm install
    bower update

### Building with Gulp

When changes are made to files in ```.\app\**```, the following will rebuild ```.\js\app.js``` and ```.\css\all.min.css```:

    gulp concat-js-app
    gulp concast-css-all

When changes are made to the libraries, usually due to updating them with the ```bower update``` command, the following will rebuild ```.\js\libs.min.js``` and ```.\css\all.min.css```:

    gulp concat-js-libs
    gulp concast-css-all

In either case, if you are certain that no css files have been updated, you may omit the second command.

When adding new files, you may need to update the appropriate variable in ```gulpfile.js```:

- jsLibs: Array of paths that will be bundled into libs.min.js
- jsApp: Array of paths that will be bundled into app.js and app.min.js
- cssLibs: Array of paths that will be bundled into all.min.css
- lessPaths: Array of paths that processed by LESS transpiler and output to app.css
- jsxPaths: Array of paths that will be processed by JSX transpiler and output to views.js (NOTE: this is concatenated into app.js)