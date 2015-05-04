// api_service.test.js
var muk = require('muk');
var config = require('./config');
var API = require('../');

describe('api_service', function () {
  var api = new API(config.corpid, config.corpsecret, config.suite_ticket);
  var pre_auth_code, permanent_code, auth_corp_info_corpid;
  before(function (done) {
    api.getSuiteToken(done);
  });

  it('getPreAuthCode should ok', function (done) {
    api.getPreAuthCode(config.apps, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('pre_auth_code');
      pre_auth_code = data.pre_auth_code;
      done();
    });
  });

  it('getPermanentCode should ok', function (done) {
    api.getPermanentCode(config.auth_code, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('permanent_code');
      permanent_code = data.permanent_code;
      auth_corp_info_corpid = data.auth_corp_info.corpid;
      done();
    });
  });

  it('getAuthInfo should ok', function (done) {
    api.getAuthInfo(auth_corp_info_corpid, permanent_code, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('auth_corp_info');
      expect(data).to.have.key('auth_info');
      done();
    });
  });

  it('getAgent should ok', function (done) {
    api.getAgent(auth_corp_info_corpid, permanent_code, 1, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });

  it('setAgent should ok', function (done) {
    api.setAgent(auth_corp_info_corpid, permanent_code, config.agent, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.property('errmsg', 'ok');
      done();
    });
  });

  it('getCorpToken should ok', function (done) {
    api.getCorpToken(auth_corp_info_corpid, permanent_code, function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('access_token');
      done();
    });
  });

});
