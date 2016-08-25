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

  var subject = require('proxyquire').noCallThru()('../../../lib/setup', {
    chalk: chalk,
    './log': log,
    'cross-spawn': spawn,
    'package-with-scripts/package.json': packageWithScripts,
    'package-with-no-scripts/package.json': packageWithNoScripts,
    fs: fs
  });

  describe('.start', function() {
    beforeEach(function() {
      sinon.stub(subject, 'install');
      sinon.stub(subject, 'getBase');
      sinon.stub(subject, 'writeJsonHook');
    });

    context('with no error', function() {
      beforeEach(function() {
        subject.install.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.getBase.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.writeJsonHook.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
      });

      it('calls each function in sequence', function() {
        subject.start({ foo: 'bar' });
        subject.install.called.should.be.true();
        subject.getBase.called.should.be.true();
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
        chalk.red.calledWith('An error occurred installing capri in your application').should.be.true()
      });
    });

    context('with an error writing the package script', function() {
      beforeEach(function() {
        subject.install.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.getBase.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, null, { foo: 'bar' });
        subject.writeJsonHook.withArgs({ foo: 'bar' }, sinon.match.func).callsArgWith(1, 'An error', null);
      });

      it('logs an error about writing the script', function() {
        subject.start({ foo: 'bar' });
        chalk.red.calledWith('An error occurred adding the npm script to start capri').should.be.true()
      });
    });

    afterEach(function() {
      subject.install.restore();
      subject.getBase.restore();
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

  describe('.getBase', function() {
    context('when base is set', function() {
      it('calls done immediately', function() {
        var done = sinon.stub();
        subject.getBase({ base: 'foo' }, done);
        done.calledWith(null, { base: 'foo' }).should.be.true();
      });
    });

    context('when base is unset', function() {
      it('finds the closest package.json', function(done) {
        subject.getBase({}, function(err, options) {
          options.base.should.equal(path.resolve(__dirname, '../../../package.json'));
          done();
        });
      });
    });
  });

  describe('.writeJsonHook', function() {
    beforeEach(function() {
      sinon.stub(subject, 'getOpts');
    });

    context('with no existing scripts', function() {
      beforeEach(function() {
        fs.writeFile.withArgs('package-with-no-scripts/package.json', JSON.stringify({
          scripts: {
            capri: 'capri start'
          }
        }, null, 2), sinon.match.func).callsArgWith(2, null)
      });

      it('creates the scripts object and adds the capri script', function() {
        var done = sinon.stub();
        subject.writeJsonHook({ base: 'package-with-no-scripts' }, done);
        done.calledWith(null).should.be.true()
      });
    });

    context('with existing scripts', function() {
      beforeEach(function() {
        fs.writeFile.withArgs('package-with-scripts/package.json', JSON.stringify({
          scripts: {
            foo: 'bar',
            capri: 'capri start'
          }
        }, null, 2), sinon.match.func).callsArgWith(2, null)
      });

      it('creates the scripts object and adds the capri script', function() {
        var done = sinon.stub();
        subject.writeJsonHook({ base: 'package-with-no-scripts/package.json' }, done);
        done.calledWith(null).should.be.true();
      });
    });

    context('with opts', function() {
      beforeEach(function() {
        subject.getOpts.withArgs({ base: 'package-with-no-scripts', port: '9' }).returns('-p 9');
        fs.writeFile.withArgs('package-with-no-scripts/package.json', JSON.stringify({
          scripts: {
            capri: 'capri -p 9 start'
          }
        }, null, 2), sinon.match.func).callsArgWith(2, null);
      });

      it('creates the scripts object and adds the capri script', function() {
        var done = sinon.stub();
        subject.writeJsonHook({ base: 'package-with-no-scripts', port: '9' }, done);
        done.calledWith(null).should.be.true();
      });
    });

    afterEach(function() {
      subject.getOpts.restore();
    });
  });

  describe('.getOpts', function() {
    context('with all the available options', function() {
      it('returns a string of options with all options specified', function() {
        subject.getOpts({ port: 12, routes: 'foo', middleware: 'bar' }).should.equal('--port 12 --routes foo --middleware bar') 
      });
    });

    context('with some of the options', function() {
      it('returns a string with only those options specified', function() {
        subject.getOpts({ routes: 'foo' }).should.equal('--routes foo') 
      });
    });

    context('with none of the options', function() {
      it('returns an empty string', function() {
        subject.getOpts({}).should.equal('');
      });
    });
  });
});
