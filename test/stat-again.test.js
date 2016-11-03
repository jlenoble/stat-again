import fs, {Stats} from 'fs';
import path from 'path';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';

import statAgain, {Stator,
  expectEventuallyFound, expectEventuallyDeleted} from '../src/stat-again';

chai.use(chaiAsPromised);

describe('Testing module stat-again', function() {

  it(`'statAgain' tries several times to stat a file'`, function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    setTimeout(fs.mkdir.bind(fs, name), 200);

    return expect(statAgain(name, 50, 10)).to.eventually.be.instanceof(Stats);
  });

  it(`'statAgain' tries so many times before failing`, function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    setTimeout(fs.mkdir.bind(fs, name), 1000);

    return statAgain(name, 30, 20).catch(err => {
      expect(err).to.match(
        new RegExp(`ENOENT: no such file or directory, stat '${name}'`));
    });
  });

  it(`'expectEventuallyFound' returns true on success`, function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    setTimeout(fs.mkdir.bind(fs, name), 200);

    return expect(expectEventuallyFound(name, 50, 10))
      .to.be.eventually.true;
  });

  it(`'expectEventuallyFound' throws an error after too long`,
    function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    setTimeout(fs.mkdir.bind(fs, name), 1000);

    return expectEventuallyFound(name, 30, 20)
      .catch(err => {
        expect(err).to.match(
          /Error: File '.*' could not be found within the imparted time frame'/);
      });
  });

  it(`'expectEventuallyDeleted' returns true on success`, function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    fs.mkdir(name);
    setTimeout(fs.rmdir.bind(fs, name), 200);

    return expect(expectEventuallyDeleted(name, 50, 10))
      .to.be.eventually.true;
  });

  it(`'expectEventuallyDeleted' throws on error after too long`,
    function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    fs.mkdir(name);
    setTimeout(fs.rmdir.bind(fs, name), 1000);

    return expectEventuallyFound(name, 30, 20)
      .catch(err => {
        expect(err).to.match(
          /`Error: File '.*' could not be deleted within the imparted time frame'`/);
      });
  });

  it('A Stator instance can stat files', function() {
    const stator = new Stator('gulpfile.babel.js');
    return expect(stator.stat()).to.eventually.be.instanceof(Stats);
  });

  it('A stator instance can try several times to stat a file', function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    const stator = new Stator(name);
    setTimeout(fs.mkdir.bind(fs, name), 200);

    return expect(stator.insist(50, 10)).to.eventually.be.instanceof(Stats);
  });

  it('A stator instance will try so many times before failing', function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    const stator = new Stator(name);
    setTimeout(fs.mkdir.bind(fs, name), 1000);

    return stator.insist(30, 20).catch(err => {
      expect(err).to.match(
        new RegExp(`ENOENT: no such file or directory, stat '${name}'`));
    });
  });

  it(`A stator instance has a method 'expectEventuallyFound'`, function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    const stator = new Stator(name);
    setTimeout(fs.mkdir.bind(fs, name), 200);

    return expect(stator.expectEventuallyFound(50, 10))
      .to.be.eventually.true;
  });

  it(`The 'expectEventuallyFound' method throws an error after too long`,
    function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    const stator = new Stator(name);
    setTimeout(fs.mkdir.bind(fs, name), 1000);

    return stator.expectEventuallyFound(30, 20)
      .catch(err => {
        expect(err).to.match(
          /Error: File '.*' could not be found within the imparted time frame'/);
      });
  });

  it(`A stator instance has a method 'expectEventuallyDeleted'`, function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    const stator = new Stator(name);
    fs.mkdir(name);
    setTimeout(fs.rmdir.bind(fs, name), 200);

    return expect(stator.expectEventuallyDeleted(50, 10))
      .to.be.eventually.true;
  });

  it(`The 'expectEventuallyDeleted' method throws an error after too long`,
    function() {
    const date = new Date();
    const name = path.join('/tmp', 'test_start-again_' + date.getTime());

    const stator = new Stator(name);
    fs.mkdir(name);
    setTimeout(fs.rmdir.bind(fs, name), 1000);

    return stator.expectEventuallyDeleted(30, 20)
      .catch(err => {
        expect(err).to.match(
          /Error: File '.*' could not be deleted within the imparted time frame'/);
      });
  });

});
