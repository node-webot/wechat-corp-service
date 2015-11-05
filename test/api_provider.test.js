// api_service.test.js
var muk = require('muk');
var config = require('./config');
var expect = require('expect.js');
var API = require('../');

describe('api_provider', function () {
  var api = new API.Provider(config.corpid, config.providersecret);

  it('getLatestToken should ok', function (done) {
    api.getLatestToken(function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('provider_access_token');
      provider_access_token = data.provider_access_token;
      done();
    });
  });

  it('getProviderToken should ok', function (done) {
    api.getProviderToken(function (err, data, res) {
      expect(err).not.to.be.ok();
      expect(data).to.have.key('provider_access_token');
      provider_access_token = data.provider_access_token;
      done();
    });
  });

  it('getLoginInfo should ok', function (done) {
    api.getLoginInfo(config.login_auth_code, function (err, data, res) {
      expect(err).not.to.be.ok();
      done();
    });
  });
});
