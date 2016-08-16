var path = require('path');
var sinon = require('sinon');
require('should');

describe('lib/setup', function() {
  var chalk = {
    red: sinon.stub(),
    cyan: sinon.stub()
  };
  var log = sinon.stub();
  var spawn = sinon.stub();
  var packageWithScripts = {
    scripts: {
      foo: 'bar'
    }
  };
  var packageWithNoScripts = {};
  var fs = {
    writeFile: sinon.stub()
  };

  var subject = require('proxyquire').noCallThru()('../../lib/setup', {
    chalk: chalk,
    './log': log,
    'cross-spawn': spawn,
    'package-with-scripts': packageWithScripts,
    'package-with-no-scripts': packageWithNoScripts,
    fs: fs
  });

  describe('.start', function() {
    beforeEach(function() {
      sinon.stub(subject, 'install');
      sinon.stub(subject, 'getRoot');
      sinon.stub(subject, 'writeJsonHook');
    });

    context('with no error', function() {
      beforeEach(function() {
        subject.install.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.getRoot.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.writeJsonHook.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
      });

      it('calls each function in sequence', function() {
        subject.start({ foo: 'bar' });
        subject.install.called.should.be.true();
        subject.getRoot.called.should.be.true();
        subject.writeJsonHook.called.should.be.true();
        chalk.red.called.should.be.false();
      });
    });

    context('with an error installing', function() {
      beforeEach(function() {
        subject.install.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, 4, null);
      });

      it('logs an error about installing', function() {
        subject.start({ foo: 'bar' });
        chalk.red.calledWith('An error occurred install capri in your application').should.be.true()
      });
    });

    context('with an error writing the package script', function() {
      beforeEach(function() {
        subject.install.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.getRoot.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.writeJsonHook.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, 'An error', null);
      });

      it('logs an error about writing the script', function() {
        subject.start({ foo: 'bar' });
        chalk.red.calledWith('An error occurred adding the npm script to start capri').should.be.true()
      });
    });

    afterEach(function() {
      subject.install.restore();
      subject.getRoot.restore();
      subject.writeJsonHook.restore();
    });
  });

  describe('.install', function() {
    var emitter = {
      on: sinon.stub()
    };

    beforeEach(function() {
      emitter.on.withArgs('close', sinon.match.func).callsArgWith(1, null)
    });

    context('when save is true', function() {
      beforeEach(function() {
        spawn.withArgs('npm', ['install', '--save-dev', 'capri'], { stdio: 'inherit' }).returns(emitter);
      });

      it('runs npm install --save-dev capri', function() {
        var done = sinon.stub()
        subject.install({ save: true }, done)
        done.calledWith(null, { save: true }).should.be.true();
      });
    });

    context('when save is false', function() {
      beforeEach(function() {
        spawn.withArgs('npm', ['install', 'capri'], { stdio: 'inherit' }).returns(emitter);
      });

      it('runs npm install --save-dev capri', function() {
        var done = sinon.stub();
        subject.install({ save: false }, done);
        done.calledWith(null, { save: false }).should.be.true();
      });
    });
  });

  describe('.getRoot', function() {
    context('when root is set', function() {
      it('calls done immediately', function() {
        var done = sinon.stub();
        subject.getRoot({ root: 'foo' }, done);
        done.calledWith(null, { root: 'foo' }).should.be.true();
      });
    });

    context('when root is unset', function() {
      it('finds the closest package.json', function(done) {
        subject.getRoot({}, function(err, options) {
          options.root.should.equal(path.resolve(__dirname, '../../package.json'));
          done();
        });
      });
    });
  });

  describe('.writeJsonHook', function() {
    context('with no existing scripts', function() {
      beforeEach(function() {
        fs.writeFile.withArgs('package-with-no-scripts', JSON.stringify({
          scripts: {
            capri: 'capri start'
          }
        }, null, 2), sinon.match.func).callsArgWith(2, null)
      });

      it('creates the scripts object and adds the capri script', function() {
        var done = sinon.stub();
        subject.writeJsonHook({ root: 'package-with-no-scripts' }, done);
        done.calledWith(null).should.be.true()
      });
    });

    context('with existing scripts', function() {
      beforeEach(function() {
        fs.writeFile.withArgs('package-with-scripts', JSON.stringify({
          scripts: {
            foo: 'bar',
            capri: 'capri'
          }
        }, null, 2), sinon.match.func).callsArgWith(2, null)
      });

      it('creates the scripts object and adds the capri script', function() {
        var done = sinon.stub();
        subject.writeJsonHook({ root: 'package-with-no-scripts' }, done);
        done.calledWith(null).should.be.true()
      });
    });

    context('with a port', function() {
      beforeEach(function() {
        fs.writeFile.withArgs('package-with-no-scripts', JSON.stringify({
          scripts: {
            capri: 'capri -p 9 start'
          }
        }, null, 2), sinon.match.func).callsArgWith(2, null)
      });

      it('creates the scripts object and adds the capri script', function() {
        var done = sinon.stub();
        subject.writeJsonHook({ root: 'package-with-no-scripts', port: '9' }, done);
        done.calledWith(null).should.be.true()
      });
    });
  });
});
