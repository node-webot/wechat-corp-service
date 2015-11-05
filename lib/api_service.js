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

/*!
 * 获取预授权码
 * 该API用于获取预授权码。预授权码用于企业号授权时的应用提供商安全验证。
 */
exports.getPreAuthCode = function (apps , callback) {
  this.suitePreRequest(this._getPreAuthCode, arguments);
};

exports._getPreAuthCode = function (apps , callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/get_pre_auth_code?suite_access_token=xxx
  var url = this.prefix + 'service/get_pre_auth_code?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    suite_id: this.suiteId
  }
  if(typeof apps === 'function'){
    //  不加 appid 参数
    callback = apps;
  } else {
    // 加入 appid 参数
    data.appid=apps;
  }

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 设置授权配置
 * 如果需要对某次授权进行配置，则调用本接口，目前仅可以设置哪些应用可以授权，不调用则默认允许所有应用进行授权。
 */

exports.setSessionInfo = function (pre_auth_code, apps, callback) {
  this.suitePreRequest(this._setSessionInfo, arguments);
};

exports._setSessionInfo = function (pre_auth_code, apps, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/set_session_info?suite_access_token=SUITE_ACCESS_TOKEN
  var url = this.prefix + 'service/set_session_info?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    pre_auth_code: pre_auth_code,
    session_info: {
      appid: apps
    }
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 获取企业号的永久授权码
 * 该API用于使用临时授权码换取授权方的永久授权码，并换取授权信息、企业access_token。
 * 临时码使用一次就会实效，需要将永久授权码保存起来，以备后续使用
 */
exports.getPermanentCode = function (authCode, callback) {
  this.suitePreRequest(this._getPermanentCode, arguments);
};

exports._getPermanentCode = function (authCode, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/get_permanent_code?suite_access_token=xxxx
  var url = this.prefix + 'service/get_permanent_code?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_code: authCode
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 该API用于通过永久授权码换取企业号的授权信息。 
 * 永久code的获取，是通过临时授权码使用get_permanent_code 接口获取到的permanent_code。
 */
exports.getAuthInfo = function (authCorpId, permanentCode, callback) {
  this.suitePreRequest(this._getAuthInfo, arguments);
};

exports._getAuthInfo = function (authCorpId, permanentCode, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/get_auth_info?suite_access_token=xxxx
  var url = this.prefix + 'service/get_auth_info?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 获取企业号应用
 * 该API用于获取授权方的企业号某个应用的基本信息，包括头像、昵称、帐号类型、认证类型、可见范围等信息
 */
exports.getAgent = function (authCorpId, permanentCode, agentId, callback) {
  this.suitePreRequest(this._getAgent, arguments);
};

exports._getAgent = function (authCorpId, permanentCode, agentId, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/get_agent?suite_access_token=xxxx
  var url = this.prefix + 'service/get_agent?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode,
    agentid: agentId
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 设置企业号应用
 * 该API用于设置授权方的企业应用的选项设置信息，如：地理位置上报等。注意，获取各项选项设置信息，需要有授权方的授权。
 * POST数据示例
 * ```````````
 *  {
 *    "suite_id":"id_value",
 *    "auth_corpid": "auth_corpid_value",
 *    "permanent_code ": "code_value",
 *    "agent": 
 *    {
 *      "agentid": "5",
 *      "report_location_flag": "0",
 *      "logo_mediaid": "xxxxx",
 *      "name": "NAME",
 *      "description": "DESC",
 *      "redirect_domain": "xxxxxx",
 *      "isreportuser":0
 *    }
 *  }
 *
 * ```````````
 */
exports.setAgent = function (authCorpId, permanentCode, agent, callback) {
  this.suitePreRequest(this._setAgent, arguments);
};

exports._setAgent = function (authCorpId, permanentCode, agent, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/set_agent?suite_access_token=xxxx
  var url = this.prefix + 'service/set_agent?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode,
    agent: agent
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 获取企业号access_token
 * 应用提供商在取得企业号的永久授权码并完成对企业号应用的设置之后，便可以开始通过调用企业接口（详见企业接口文档）来运营这些应用。其中，调用企业接口所需的access_token获取方法如下。
 */
exports.getCorpToken = function (authCorpId, permanentCode, callback) {
  this.suitePreRequest(this._getCorpToken, arguments);
};

exports._getCorpToken = function (authCorpId, permanentCode, callback) {
  // https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token?suite_access_token=xxxx
  var url = this.prefix + 'service/get_corp_token?suite_access_token=' + this.suiteToken.suite_access_token;
  var data = {
    suite_id: this.suiteId,
    auth_corpid: authCorpId,
    permanent_code: permanentCode
  };

  this.request(url, postJSON(data), wrapper(callback));
};
