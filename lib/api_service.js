var urllib = require('urllib');
var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/*!
 * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
 * 无需依赖getAccessToken为前置调用。
 * 应用开发者无需直接调用此API。
 *
 * Examples:
 * ```
 * api.suitePreRequest(method, arguments);
 * ```
 * @param {Function} method 需要封装的方法
 * @param {Array} args 方法需要的参数
 */
exports.getPreAuthCode = function (apps, callback) {
  this.suitePreRequest(this._getPreAuthCode, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._getPreAuthCode = function (apps, callback) {
  var url = this.prefix + 'service/get_pre_auth_code?suite_access_token=' + this.suiteToken.sutie_access_token;
  var data = {
    suite_id: this.suiteId,
    appid: apps
  };

  urllib.request(url, postJSON(data), wrapper(callback));
};

exports.getPermanentCode = function (authCode, callback) {
  this.suitePreRequest(this._getPermanentCode, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._getPermanentCode = function (authCode, callback) {
  var url = this.prefix + 'service/get_permanent_code?suite_access_token=' + this.suiteToken.sutie_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_code: authCode
  };

  urllib.request(url, postJSON(data), wrapper(callback));
};

exports.getAuthInfo = function (authCorpId, permanentCode, callback) {
  this.suitePreRequest(this._getAuthInfo, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._getAuthInfo = function (authCorpId, permanentCode, callback) {
  var url = this.prefix + 'service/get_auth_info?suite_access_token=' + this.suiteToken.sutie_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode
  };

  urllib.request(url, postJSON(data), wrapper(callback));
};

exports.getAgent = function (authCorpId, permanentCode, agentId, callback) {
  this.suitePreRequest(this._getAgent, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._getAgent = function (authCorpId, permanentCode, agentId, callback) {
  var url = this.prefix + 'service/get_agent?suite_access_token=' + this.suiteToken.sutie_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode,
    agentid: agentId
  };

  urllib.request(url, postJSON(data), wrapper(callback));
};

exports.setAgent = function (authCorpId, permanentCode, agent, callback) {
  this.suitePreRequest(this._setAgent, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._setAgent = function (authCorpId, permanentCode, agent, callback) {
  var url = this.prefix + 'service/set_agent?suite_access_token=' + this.suiteToken.sutie_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode,
    agent: agent
  };

  urllib.request(url, postJSON(data), wrapper(callback));
};

exports.getCorpToken = function (authCorpId, permanentCode, callback) {
  this.suitePreRequest(this._getCorpToken, arguments);
};

/*!
 * 创建部门的未封装版本
 */
exports._getCorpToken = function (authCorpId, permanentCode, callback) {
  var url = this.prefix + 'service/get_corp_token?suite_access_token=' + this.suiteToken.sutie_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode
  };

  urllib.request(url, postJSON(data), wrapper(callback));
};
