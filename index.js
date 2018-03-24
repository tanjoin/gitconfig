#!/usr/bin/env node

/**
 * gitconfig
 * ver. 1.1.0
 */

const fs = require('fs');
const path = require('path');
const GitConfig = require('./gitconfig.js');
const commander = require('commander');
const homedir = require('os').homedir();

const gitconfig = new GitConfig();

if (!gitconfig.existsConfig()) {
  console.error("Error: not found .tjconfig  \n" + gitconfig.configPath);
  console.log(JSON.stringify(gitconfig.config, null, 2));
  return;
}

/**
 * Commander
 */
commander.version('1.1.0', '-v, --version');

commander.command('show')
  .description('登録情報を表示します.')
  .action(() => gitconfig.show());

commander.command('delete')
  .option('-t, --target <index>', 'delete target', parseInt)
  .description('登録しているユーザー情報を削除します.')
  .action((options) => gitconfig.deleteUser(cmd.target))

commander.command('ssh <hostname>')
  .description('regists hostname.')
  .option('-t, --target <index>', 'hostname target', parseInt)
  .option('-d, --delete', '')
  .action((hostname, options) => gitconfig.hostname(hostname, options.target, options.delete));

commander.command('user <name>')
  .description('regists user.')
  .option('-t, --target <index>', 'user target', parseInt)
  .option('-d, --delete', '')
  .action((name, options) => gitconfig.name(name, options.target, options.delete));

commander.command('email <email>')
  .description('regists email.')
  .option('-t, --target <index>', 'email target', parseInt)
  .option('-d, --delete', '')
  .action((email, options) => gitconfig.email(email, options.target, options.delete));

commander.arguments('<path>')
  .description('regist user data in .git/config')
  .option('-t --target <index>', '設定するユーザー情報の番号', parseInt)
  .action((path, options) => gitconfig.set(path));

commander.parse(process.argv);
