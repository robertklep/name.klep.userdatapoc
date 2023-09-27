const Homey   = require('homey');
const process = require('node:process');
const fs      = require('node:fs/promises');

const TESTDIR = '/userdata/foo/bar/blah';

module.exports = class MyApp extends Homey.App {

  async onInit() {
    await this.initializePersistence();
  }

  async initializePersistence() {
    try {
      await fs.access(TESTDIR, fs.constants.W_OK);
      this.log(`persistence directory '${ TESTDIR }' exists`);
    } catch(e) {
      this.log(`creating persistence directory '${ TESTDIR }:`);
      try {
        await fs.mkdir(TESTDIR, { recursive : true, mode : 0o777 });
        this.log(`- success 🥳`);
      } catch(e) {
        this.error(`- failed 😭`);
        this.error(e);
        // cannot continue
        throw Error(`Internal Error (mkdir: ${ e.message })`);
      }
    }
    this.log(`changing to persistence directory:`);
    try {
      process.chdir(TESTDIR);
      this.log(`- success 🥳`);
    } catch(e) {
      this.error(`- failed 😭`);
      this.error(e);
      // cannot continue
      throw Error(`Internal Error (chdir: ${ e.message })`);
    }
    this.log(`making sure persistence directory has the correct permissions:`)
    try {
      await fs.chmod(TESTDIR, 0o777);
      this.log(`- success 🥳`);
    } catch(e) {
      this.error(`- failed 😭`);
      this.error(e);
      // cannot continue
      throw Error(`Internal Error (chmod: ${ e.message })`);
    }
    this.log('Permissions:', (await fs.stat(TESTDIR)).mode.toString(8) );
  }

}
