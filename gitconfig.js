const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const homedir = require('os').homedir();

module.exports = class GitConfig {

  constructor() {

    /**
     * Read config file
     */

    this.configPath = path.resolve(homedir, '.tjconfig');

    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, '{"data":[], "version":"2"}', 'utf8');
    }

    this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));

    if (this.isVersion1()) {
      var data = {
        "users": [
          this.config
        ]
      };
      data.users[0].name = data.users[0].user;
      data.users[0].user = undefined;
      this.config = data;
    }
  }

  /**
   * Old JSON data.
   */
  isVersion1() {
    return !this.config.version;
  }

  /**
   * .git/config settings
   */
  existsConfig() {
    if (!this.config || !this.config.users || this.config.users.length == 0) {
      return false;
    }
    return true;
  }

  set(path, target) {
    const targetPath = path.resolve(path);
    if (!fs.existsSync(targetPath)) {
      console.error("Error: wrong path.  \n" + targetPath);
      return;
    }
    let gitconfigPath = undefined;
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
    setUserName(target.name);
    setEmail(target.email);
    setHostName(target.hostName);
  }

  /**
   * ユーザー名を設定
   */
  setUserName(userName) {
    if (!userName) {
      return;
    }
    execSync('git config user.name "' + userName + '"');
  }

  /**
   * Email を設定
   */
  setEmail(email) {
    if (!email) {
      return;
    }
    execSync('git config user.email "' + email + '"');
  }

  /**
   * SSH の hostname を設定
   */
  setHostName(hostName) {
    if (!hostName) {
      return;
    }
    const url = execSync('git config remote.origin.url').toString();
    execSync('git config remote.origin.url ' + url.replace(/git@(.*):/, "git@" + hostName + ":"));
  }

  /**
   * Show config.
   */
  show() {
    this.config.users
      .map((d) => JSON.stringify(d, null, 2))
      .forEach((str) => console.log(str));
  }

  /**
   * Delete config.
   */
  deleteUser(id = 0) {
    this.config.users.splice(id, 1);
  }

  /**
   * SSH hostname settings.
   */
  hostname(hostname, id = 0, isDelete = false) {
    if (isDelete) {
      this.config.users
        .filter((item, index) => index === id)
        .forEach((item) => item.hostname = undefined);
      save();
    } else {
      this.config.users
        .filter((item, index) => index === id)
        .forEach((item) => item.hostname = hostname);
      save();
    }
  }

  /**
   * Email settings.
   */
  email(email, id = 0, isDelete = false) {
    if (isDelete) {
      this.config.users
        .filter((item, index) => index === id)
        .forEach((item) => item.email = undefined);
      save();
    } else {
      this.config.users
        .filter((item, index) => index === id)
        .forEach((item) => item.email = email);
      save();
    }
  }

  /**
   * User settings.
   */
  name(name, id = 0, isDelete = false) {
    if (isDelete) {
      this.config.users
        .filter((item, index) => index === id)
        .forEach((item) => item.name = undefined);
      save();
    } else {
      this.config.users
        .filter((item, index) => index === id)
        .forEach((item) => item.name = name);
      save();
    }
  }

  /**
   * Save config.
   */
  save() {
    fs.writeFileSync(configPath, JSON.stringify(this.config), 'utf8');
  }
}
