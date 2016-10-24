import fs, {Stats} from 'fs';

export class Stator {

  constructor(pathname) {
    const _pathname = pathname;

    Object.defineProperty(this, 'pathname', {
      get() {return _pathname;}
    });
  }

  stat() {
    return new Promise((resolve, reject) => {
      fs.stat(this.pathname, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stats);
      });
    });
  }

  insist(delay = 100, times = 10) {
    if (!Number.isInteger(times)) {
      throw TypeError('times is not an integer: ', times);
    }

    return this.stat().catch(err => {
      let res = err.message
        .match(/ENOENT: no such file or directory, stat '(.*)'/);
      if (res && res[1] === this.pathname) {
        // Expected error, this.pathname does not exist
        if (times > 0) {
          // Try again
          return new Promise(((resolve, reject) => {
            function tryAgain() {
              resolve(this.insist(delay, times - 1));
            }
            setTimeout(tryAgain.bind(this), delay);
          }));
        } else {
          // Abort, too many attempts
          throw err;
        }
      } else {
        // Abort, unexpected error
        throw err;
      }
    });
  }

  expectEventuallyFound(delay = 100, times = 0) {
    return this.insist(delay, times).then(
      res => res instanceof Stats,
      err => false);
  }

  expectEventuallyDeleted(delay = 100, times = 0) {
    if (!Number.isInteger(times)) {
      throw TypeError('times is not an integer: ', times);
    }

    return this.stat().then(res => {
      if (times > 0) {
        // Unhappy res, try again
        return new Promise((resolve, reject) => {
          function tryAgain() {
            this.expectEventuallyDeleted(delay, times - 1)
              .then(resolve, reject);
          }
          setTimeout(tryAgain.bind(this), delay);
        });
      } else {
        // Abort, too many attempts
        return Promise.resolve(false);
      }
    }, err => {
      let res = err.message
        .match(/ENOENT: no such file or directory, stat '(.*)'/);
      if (res && res[1] === this.pathname) {
        // Happy error, this.pathname does not exist
        return true;
      } else {
        // Abort, unexpected error
        throw err;
      }
    });
  }

};

export default function statAgain(pathname, delay = 100, times = 10) {
  const stator = new Stator(pathname);
  return stator.insist(delay, times);
};

export function expectEventuallyFound(pathname, delay = 100, times = 0) {
  const stator = new Stator(pathname);
  return stator.expectEventuallyFound(delay, times);
};

export function expectEventuallyDeleted(pathname, delay = 100, times = 0) {
  const stator = new Stator(pathname);
  return stator.expectEventuallyDeleted(delay, times);
};
