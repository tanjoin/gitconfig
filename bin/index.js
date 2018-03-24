#!/usr/bin/env node

/**
 * gitconfig
 * ver. 1.1.0
 */

const fs = require('fs');
const path = require('path');
const GitConfig = require('../gitconfig.js');
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

commander.command('rename')
  .description('既存のコミットの名前とメールアドレスを変更する.')
  .option('-n, --name <name>', '書き換え後のユーザー名')
  .option('-e, --email <email>', '書き換え後のメールアドレス')
  .option('-c, --commit', 'コミットの書き換え')
  .option('-a, --all', 'すべてのコミットを対象にする')
  .option('-y --yes', '同意する')
  .action((options) => (options.yes && options.all && options.commit) ? gitconfig.renameAllCommits(options.name, options.email) : console.error("同意してください."));

commander.arguments('<path>')
  .description('regist user data in .git/config')
  .option('-t --target <index>', '設定するユーザー情報の番号', parseInt)
  .action((path, options) => gitconfig.set(path, options.target));

commander.parse(process.argv);

if (commander.args.length === 0) {
  commander.help();
}
