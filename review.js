#!/usr/bin/env node
'use strict';

var shell = require('shelljs');
var xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

shell.config.fatal = true;
shell.config.silent = true;

var args = process.argv.slice(2);

if (args.length < 1) {
  shell.echo('Must specify a URL');
  shell.exit(1);
}

process.on('exit', function (code) {
  if (code)
    shell.echo('ERROR: ' + shell.error());
});

///////////////
// Setup
///////////////

// Clean up the url
// Of the form: https://github.com/shelljs/benchmarks/pull/6
var repoName;
var remoteName;
var urlMatch = args[0].match(/^https:\/\/github.com\/(.+)\/(.+)\/pull\/(\d+)/);
if (urlMatch) {
  var prUrl = urlMatch[0];
  var ownerName = urlMatch[1];
  repoName = urlMatch[2];
  var prNumber = 'PR_' + urlMatch[3];

  // Pull the web page, parse it, and determine the correct URLs
  shell.echo('Pulling your URL...');
  shell.echo(prUrl);
  var html = shell.exec('curl ' + prUrl).output;
  shell.echo('URL successfully fetched');

  // For parsing with xpath
  var parserArgs = {
    errorHandler:{} // silence error messages
  };
  var doc = new dom(parserArgs).parseFromString(html);
  var nodes = xpath.select('//head/title', doc);
  var page_title = nodes[0].firstChild.data.trim();
  shell.echo(page_title);

  var re = /[\u0000-\u007F]*/g;
  var matches = page_title.match(re);
  var description = matches[0].trim();

  nodes = xpath.select('//div/div/a[@class="author pull-header-username css-truncate css-truncate-target expandable"]', doc);
  var author = nodes[0].firstChild.data.trim();

  nodes = xpath.select('//div/div/span[@class="commit-ref current-branch css-truncate user-select-contain expandable"]/span', doc);

  var branch_name;
  var upstream;
  if (nodes.length === 4) {
    // remote
    remoteName = nodes[2].firstChild.data.trim();
    branch_name = nodes[3].firstChild.data.trim();
    upstream = 'https://github.com/' + ownerName + '/' + repoName + '.git';
  } else {
    // from the same repo
    remoteName = ownerName;
    branch_name = nodes[1].firstChild.data.trim();
  }
} else if (!(urlMatch = args[0].match(/^https:\/\/github.com\/(.+)\/([^\/]+)/))) {
  console.error('URL format is incorrect');
  shell.exit(1);
}
// Setup directories
remoteName = remoteName || urlMatch[1];
repoName = repoName || urlMatch[2];
var topDir = prNumber || 'review_' + repoName;
var name = topDir;
shell.rm('-Rf', name);
shell.mkdir(name);
shell.cd(name);
name = 'node_modules/';
shell.mkdir(name);

// Clone the person's repo
shell.echo('Cloning the repository...');
var cloneCmd = 'git clone' +
    (branch_name ? ' -b ' + branch_name : '') +
    ' https://github.com/' +
    remoteName + '/' + repoName + '.git';
shell.echo(cloneCmd);
shell.exec(cloneCmd);

shell.ls().forEach(function (dir) {
  if (dir === 'node_modules')
    return; // don't do anything
  shell.cd(dir);
});

if (upstream) {
  shell.echo('Adding upstream');
  shell.exec('git remote add upstream ' + upstream);
  shell.exec('git fetch upstream');
} else if (shell.exec('git rev-parse --abbrev-ref HEAD').stdout.trim() !== 'master') {
  shell.exec('git fetch origin master:master');
}

shell.config.silent = false;
shell.echo('Installing dependencies...');
shell.exec('npm install'); // install dependencies

shell.cd('..');
shell.mv(repoName, 'node_modules/');
shell.cd('node_modules/' + repoName);

if (repoName.toLowerCase() === 'shx') {
  shell.exec('npm run build');
}

// installs bin scripts
shell.exec('npm install');

shell.config.fatal = false;

// **Specific to ShellJS**
if (repoName.toLowerCase() === 'shelljs') {
  // Run interesting tests
  var bugsToFix = [];

  shell.exec('node ./scripts/generate-docs.js');
  if (shell.exec('git diff --quiet README.md').code !== 0) {
    bugsToFix.append('docs');
    shell.echo('Please generate docs');
  }

  shell.echo('Running tests');
  if (shell.exec('npm test').code !== 0) {
    bugsToFix.append('tests');
  }

  if (bugsToFix.length > 0) {
    shell.echo('===================');
    shell.echo('Must fix:');
    shell.echo(bugsToFix);
    shell.exit(1);
  } else {
    // Output useful info
    shell.echo('Testing out Pull Request #' + prNumber);
    shell.echo('> ' + description);
    shell.echo();
    shell.echo('This PR passes initial tests!');
  }
}

shell.echo('cd ' + topDir + '/    or');
shell.echo('cd ' + topDir + '/node_modules/' + repoName + '/');
