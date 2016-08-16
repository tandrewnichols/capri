var sinon = require('sinon');

describe('lib/capri', function() {
  var childProcess = {
    execSync: sinon.stub()
  };
  var opn = sinon.stub();
  var detectPort = (port) => {
    return Promise.resolve('port');
  };
  var log = sinon.stub();
  var inquirer = {
    prompt: sinon.stub()
  };
  var webpack = sinon.stub();

  var subject = require('proxyquire').noCallThru()('../../../lib/capri', {
    child_process: childProcess,
    opn: opn,
    'detect-port': detectPort,
    './log': log,
    inquirer: inquirer,
    webpack: webpack
  });

  describe('.run', function() {
    beforeEach(function() {
      sinon.stub(subject, 'detect');
      sinon.stub(subject, 'setupCompiler');
      sinon.stub(subject, 'startServer');
    });

    context('with an error', function() {
      beforeEach(function() {
        sinon.stub(process, 'exit');
        subject.detect.withArgs({}, sinon.match.func).callsArgWith(1, 'error');
      });

      it('calls process.exit', function() {
        subject.run({});
        process.exit.called.should.be.true()
      });

      afterEach(function() {
        process.exit.restore();
      });
    });

    context('with no error', function() {
      beforeEach(function() {
        subject.detect.withArgs({}, sinon.match.func).callsArgWith(1, null);
        subject.setupCompiler.withArgs({}).returns('compiler');
      });

      it('starts the server', function() {
        subject.run({});
        subject.startServer.calledWith({}, 'compiler').should.be.true()
      });
    });

    afterEach(function() {
      subject.detect.restore();
      subject.setupCompiler.restore();
      subject.startServer.restore();
    });
  });

  describe('.detect', function() {
    beforeEach(function() {
      sinon.stub(subject, 'getNewPort');
    });

    context('with a port that is in use', function() {
      beforeEach(function() {
        subject.getNewPort.withArgs({ port: 'not port' }, sinon.match.func).callsArg(1);
      });

      it('calls getNewPort', function(done) {
        subject.detect({ port: 'not port' }, () => {
          subject.getNewPort.called.should.be.true()
          done();
        });
      });
    });

    context('with a port that is not in use', function() {
      it('calls done immediately', function(done) {
        subject.detect({ port: 'port' }, () => {
          subject.getNewPort.called.should.be.false()
          done();
        });
      });
    });

    afterEach(function() {
      subject.getNewPort.restore();
    });
  });

  describe('.getNewPort', function() {
    beforeEach(function() {
      sinon.stub(subject, 'clearConsole');
    });

    context('when the user opts not to enter a new port', function() {
      beforeEach(function() {
        inquirer.prompt.withArgs([sinon.match.object, sinon.match.object]).returns(Promise.resolve({ change: false }));
      });

      it('calls done with true to indicate an error', function(done) {
        subject.getNewPort({ port: 4 }, (err) => {
          subject.clearConsole.called.should.be.true()
          err.should.be.true();
          done();
        });
      });
    });

    context('when the user opts to enter a new port', function() {
      beforeEach(function() {
        inquirer.prompt.withArgs([sinon.match.object, sinon.match.object]).returns(Promise.resolve({ change: true }));
      });

      it('calls done with no arguments', function(done) {
        subject.getNewPort({ port: 4 }, (err) => {
          (err === undefined).should.be.true();
          subject.clearConsole.called.should.be.true()
          done();
        });
      });
    });

    afterEach(function() {
      subject.clearConsole.restore();
    });
  });

  describe('.setupCompiler', function() {
    var compiler = {
      plugin: sinon.stub()
    };
    var stats = {
      hasErrors: sinon.stub(),
      hasWarnings: sinon.stub()
    };

    beforeEach(function() {
      webpack.withArgs(sinon.match.object).returns(compiler);
      sinon.stub(subject, 'clearConsole');
      compiler.plugin.withArgs('invalid', sinon.match.func).callsArg(1);
      compiler.plugin.withArgs('done', sinon.match.func).callsArgWith(1, stats);
    });

    context('with no errors starting the server', function() {
      beforeEach(function() {
        stats.hasErrors.returns(false);
      });

      it('logs success', function() {
        var res = subject.setupCompiler({ port: 4 });
        log.calledWith('The app is running at http://localhost:4/').should.be.true();
        res.should.eql(compiler);
        subject.clearConsole.called.should.be.true()
      });
    });

    context('with errors starting the server', function() {
      beforeEach(function() {
        log.reset();
        stats.hasErrors.returns(true);
      });

      it('does not log', function() {
        var res = subject.setupCompiler({ port: 4 });
        log.calledWith('The app is running at http://localhost:4/').should.be.false();
        res.should.eql(compiler);
        subject.clearConsole.called.should.be.true();
      });
    });

    afterEach(function() {
      subject.clearConsole.restore();
    });
  });
});
