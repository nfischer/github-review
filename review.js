#!/usr/bin/env node

'use strict';

require('shelljs/global');
var xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

var GITHUB_HTML = 'github.html';

config.fatal = true;
config.silent = true;

var args = process.argv.slice(2);

if (args.length < 1) {
  echo('Must specify a URL');
  exit(1);
}

///////////////
// Setup
///////////////

// Clean up the url
// Of the form: https://github.com/shelljs/benchmarks/pull/6
var urlMatch = args[0].match(/^https:\/\/github.com\/(.*)\/(.*)\/pull\/(\d+)/);
if (!urlMatch) {
  console.error('URL format is incorrect');
  exit(1);
}

var prUrl = urlMatch[0];
var ownerName = urlMatch[1];
var repoName = urlMatch[2];
var prNumber = 'PR_' + urlMatch[3];

// Pull the web page, parse it, and determine the correct URLs
echo('Pulling your URL...');
echo(prUrl);
var html = exec('curl ' + prUrl).output;
echo('URL successfully fetched');

// For parsing with xpath
var parserArgs = {
  errorHandler:{} // silence error messages
};
var doc = new dom(parserArgs).parseFromString(html);
var nodes;

nodes = xpath.select('//head/title', doc);
var page_title = nodes[0].firstChild.data.trim();
echo(page_title);

var re = /[\u0000-\u007F]*/g;
var matches = page_title.match(re);
var description = matches[0].trim();

nodes = xpath.select('//div/div/a[@class="author pull-header-username css-truncate css-truncate-target expandable"]', doc);
var author = nodes[0].firstChild.data.trim();

nodes = xpath.select('//div/div/span[@class="commit-ref current-branch css-truncate user-select-contain expandable"]/span', doc);

var remoteName;
var branch_name;
var upstream;
if (nodes.length === 4) {
  // remote
  remoteName = nodes[2].firstChild.data.trim();
  branch_name = nodes[3].firstChild.data.trim();
  // upstream = 'https://github.com/' + nodes[0].firstChild.data + '/shelljs.git';
  upstream = 'https://github.com/' + ownerName + '/' + repoName + '.git';
} else {
  // from the same repo
  remoteName = ownerName;
  branch_name = nodes[1].firstChild.data.trim();
}

// Setup directories
var name = prNumber;
rm('-Rf', name);
mkdir(name);
cd(name);
name = 'node_modules/';
mkdir(name);
cd(name);

// Clone the person's repo
echo('Cloning the branch...');
var cloneCmd = 'git clone -b ' + branch_name + ' https://github.com/' +
    remoteName + '/' + repoName + '.git';
echo(cloneCmd);
exec(cloneCmd);

cd(ls()[0]); // There's only one file, and it's our folder
if (upstream) {
  echo('Adding upstream');
  exec('git remote add upstream ' + upstream);
}

config.silent = false;
echo('Installing dependencies...');
exec('npm install'); // install dependencies

config.fatal = false;

///////////////
// End of setup
///////////////

// **Specific to ShellJS**

if (repoName.toLowerCase() === 'shelljs') {
  // Run interesting tests
  // var bugsToFix = ['fake'];
  var bugsToFix = [];

  if (exec('git diff --quiet README.md').code !== 0) {
    bugsToFix.append('docs');
    echo('Please generate docs');
  }

  echo('Running tests');
  if (exec('npm test').code !== 0) {
    bugsToFix.append('tests');
  }

  if (bugsToFix.length > 0) {
    echo('===================');
    echo('Must fix:');
    echo(bugsToFix);
    exit(1);
  } else {
    // Output useful info
    echo('Testing out Pull Request #' + prNumber);
    echo('> ' + description);
    echo();
    echo('This PR passes initial tests!');
  }
}
echo('cd ' + prNumber + '/    or');
echo('cd ' + prNumber + '/node_modules/' + repoName + '/');
