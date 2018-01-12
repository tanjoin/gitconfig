#!/usr/bin/env node

/**
 * gitconfig
 * ver. 1.0.3
 */

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const homedir = require('os').homedir();

const configPath = path.resolve(homedir, '.tjconfig');

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, '{}', 'utf8');
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const main = (argv) => {
  const argc = argv.length;

  if (argc === 3 && argv[2] === "show") {
    for (var key in config) {
      console.log(key + "\t" + config[key]);
    }
    return;
  }

  // ssh settings
  if (argc === 4 && argv[2] === "ssh") {
    let userconfig = JSON.parse(JSON.stringify(config));
    if (argv[3] === "--delete") {
      userconfig.ssh = null;
    } else {
      userconfig.ssh = argv[3];
    }
    fs.writeFileSync(configPath, JSON.stringify(userconfig), 'utf8');
    return;
  }

  // user settings
  if (argc === 4 && argv[2] === "user") {
    let userconfig = JSON.parse(JSON.stringify(config));
    if (argv[3] === "--delete") {
      userconfig.user = null;
    } else {
      userconfig.user = argv[3];
    }
    fs.writeFileSync(configPath, JSON.stringify(userconfig), 'utf8');
    return;
  }

  // email settings
  if (argc === 4 && argv[2] === "email") {
    let userconfig = JSON.parse(JSON.stringify(config));
    if (argv[3] === "---delete") {
      userconfig.email = null;
    } else {
      userconfig.email = argv[3];
    }
    fs.writeFileSync(configPath, JSON.stringify(userconfig), 'utf8');
    return;
  }

  // .git/config settings
  if (!config.user || !config.email) {
    console.error("Error: User config is not found. \n    gitconfig user xxx\n    gitconfig email xxx@yyy.zz");
    return;
  }
  if (argc !== 3) {
    console.error("Error: wrong arguments.");
    return;
  }
  const targetPath = path.resolve(argv[2]);

  if (!fs.existsSync(targetPath)) {
    console.error("Error: wrong path.  \n" + targetPath);
    return;
  }

  let gitconfigPath = null;

  if (fs.statSync(targetPath).isDirectory()) {
    gitconfigPath = targetPath + "/.git/config";
    if (!fs.existsSync(gitconfigPath)) {
      console.error("Error: not found .git/config  \n" + gitconfigPath);
      return;
    }
  } else {
    console.error("Error: wrong path. This command is only directory path.  \n" + targetPath);
    return;
  }

  if (!gitconfigPath) {
    console.error("Error: not found file path.");
    return;
  }

  execSync('git config user.name "' + config.user + '"');
  execSync('git config user.email "' + config.email + '"');
  if (config.ssh) {
    const url = execSync('git config remote.origin.url').toString();
    execSync('git config remote.origin.url ' + url.replace(/git@(.*):/, "git@" + config.ssh + ":"));
  }
};

main(process.argv);
