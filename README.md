# Github Review

A simple tool to help me pull down and review Github PRs.

This is geared toward reviewing NodeJS projects since that's what I'm reviewing
these days. This is specifically geared toward reviewing PRs from
[ShellJS](https://github.com/shelljs/shelljs) and [its various off-shoot
projects](https://github.com/shelljs). I also use this to help review
[cash](https://github.com/dthree/cash) and [my Bash-to-ShellJS
translator](https://github.com/nfischer/BashToShellJS).

Feel free to try this out for your Github projects! If you like it, drop me a
line.

If you find any bugs, please see [the wiki
page](https://github.com/nfischer/github-review/wiki) for a guide on submitting
bug reports (I'd love to get them so I know what I can fix). If you have any
improvements, please open a pull request (which I'll try reviewing via this
tool!) or give me a feature suggestion via Github issue. I'm more than happy to
branch this off into a more general and powerful project.

## Installation

```bash
$ npm install -g nfischer/github-review
```

## Usage

 1. Visit your favorite Github node project. Pick an *open* pull request
 2. Copy out the pull request's URL (anything that has
    `user/repo/pull/<num>/...`)
 3. Paste it on the commandline:

 ```Bash
 # Save yourself some typing, paste in whatever URL is in your browser
 $ review.js https://github.com/shelljs/shx/pull/14
 $ review.js https://github.com/shelljs/shx/pull/14/files # this works too
 $ review.js https://github.com/shelljs/shx/pull/14#discussion_r55946766 # even this
 ```

 4. Press enter, watch the magic happen, and `cd` into the new `PR_14/`
    directory

Also, you can also paste in the URL of the repo itself to clone & test the
master branch:

```Bash
# Clone & test the master branch
$ review.js https://github.com/shelljs/shx
```

## System Compatibility

This is written mainly in ShellJS, so this is supposed to be compatible with
Linux, Mac OS X, and Windows. Note: you must have `curl` installed for this
script to run. Don't like that? I'll gladly accept a PR fixing that.

If you find that this script doesn't run on your system, let me know and I'll
try to fix that as well.
