var sinon = require('sinon');
require('should');

describe('bin/capri', function() {
  var argv = null;
  var capri = {
    run: sinon.stub()
  };
  var setup = {
    start: sinon.stub()
  };

  beforeEach(function() {
    argv = process.argv;
  });

  afterEach(function() {
    process.argv = argv;
    argv = null;
  });

  context('.init', function() {

    context('with no options', function() {
      beforeEach(function() {
        process.argv = ['node', 'capri', 'init'];
      });

      it('calls setup.start with normal options', function() {
        var subject = require('proxyquire').noPreserveCache().noCallThru()('../../bin/capri', {
          '../lib/setup': setup,
          '../lib/capri': capri
        });

        setup.start.calledWith(sinon.match.object).should.be.true()

        // Otherwise, we get warnings about max event emitters when running --watch
        subject.removeAllListeners('init');
        subject.removeAllListeners('start');
        subject.removeAllListeners('--help');
        subject.removeAllListeners('version');
      });
    });

    context('with short options', function() {
      beforeEach(function() {
        process.argv = ['node', 'capri', 'init', '-S', '-r', 'foo', '-H', '-p', '4']
      });

      it('calls setup.start with extra options', function() {
        var subject = require('proxyquire').noPreserveCache().noCallThru()('../../bin/capri', {
          '../lib/setup': setup,
          '../lib/capri': capri
        });

        setup.start.calledWith(sinon.match({ save: false, root: 'foo', hook: false, port: '4' })).should.be.true()

        subject.removeAllListeners('init');
        subject.removeAllListeners('start');
        subject.removeAllListeners('--help');
        subject.removeAllListeners('version');
      });
    });

    context('with long options', function() {
      beforeEach(function() {
        process.argv = ['node', 'capri', 'init', '--no-save', '--root', 'foo', '--no-hook', '--port', '4']
      });

      it('calls setup.start with the same extra options', function() {
        var subject = require('proxyquire').noPreserveCache().noCallThru()('../../bin/capri', {
          '../lib/setup': setup,
          '../lib/capri': capri
        });

        setup.start.calledWith(sinon.match({ save: false, root: 'foo', hook: false, port: '4' })).should.be.true()
      });
    });
  });

  describe('.start', function() {
    context('with no options', function() {
      beforeEach(function() {
        process.argv = ['node', 'capri', 'start'];
      });

      it('calls capri.run with normal options', function() {
        var subject = require('proxyquire').noPreserveCache().noCallThru()('../../bin/capri', {
          '../lib/setup': setup,
          '../lib/capri': capri
        });

        capri.run.calledWith(sinon.match.object).should.be.true()
      });
    });

    context('with short options', function() {
      beforeEach(function() {
        process.argv = ['node', 'capri', 'start', '-p', '4'];
      });

      it('calls capri.run with extra options', function() {
        var subject = require('proxyquire').noPreserveCache().noCallThru()('../../bin/capri', {
          '../lib/setup': setup,
          '../lib/capri': capri
        });

        capri.run.calledWith(sinon.match({ port: '4' })).should.be.true()
      });
    });

    context('with long options', function() {
      beforeEach(function() {
        process.argv = ['node', 'capri', 'start', '--port', '4'];
      });

      it('calls capri.run with the same extra options', function() {
        var subject = require('proxyquire').noPreserveCache().noCallThru()('../../bin/capri', {
          '../lib/setup': setup,
          '../lib/capri': capri
        });

        capri.run.calledWith(sinon.match({ port: '4' })).should.be.true()
      });
    });
  });
});
