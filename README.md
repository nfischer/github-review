# Github Review

A simple tool to help me pull down and review Github PRs.

This is geared toward reviewing node projects since that's what I'm reviewing
these days. This is specifically geared toward reviewing PRs from
[ShellJS](https://github.com/shelljs/shelljs) and [its various off-shoot
projects](https://github.com/shelljs). I also use this to help review
[cash](https://github.com/dthree/cash) and [my Bash-to-ShellJS
translator](https://github.com/nfischer/BashToShellJS).

Feel free to try this out for your project! If you like it, let me know. If you
have any improvements, please submit a github issue or a pull request (which
I'll try reviewing via this tool!). I'm more than happy to branch this off into
a more general project, I've just started out making it a very specific tool to
help make my life a bit easier.

## Installation

Clone it:

```Bash
$ git clone https://github.com/nfischer/github-review.git
```

Install it:

```Bash
$ cd github-review
$ npm install
```

Link it:

```Bash
# make a symlink to somewhere in your PATH, like ~/bin/
$ ln /path/to/github-review/review.js ~/bin/review.js
```

## Usage

 1. Visit your favorite Github node project. Pick an *open* pull request
 2. Copy out the pull request's URL (anything that has
    `user/repo/pull/<num>/...`)
 3. Paste it on the commandline:

 ```Bash
 $ review.js https://github.com/shelljs/shx/pull/14
 ```

 4. Press enter, watch the magic happen, and `cd` into the new `PR_14/`
    directory
 5. Not easy enough? Use something like `tmux` to copy the outputted `cd`
    command (scroll to the line and press `shift-V` `y`) and paste that to your
    terminal with `ctrl-shift-V` to get there automagically :sunglasses:

## Compatibility

This is written mainly in ShellJS, so this is supposed to be compatible with
Linux, Mac OS X, and Windows. Note: you must have `curl` installed for this
script to run. Don't like that? I'll gladly accept a PR fixing that.

If you find that this script doesn't run on your system, let me know and I'll
try to fix that as well.
