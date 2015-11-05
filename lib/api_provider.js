var urllib = require('urllib');
var util = require('./util');
var extend = require('util')._extend;
var wrapper = util.wrapper;
var postJSON = util.postJSON;

var api_common = require('./api_common');

var ProviderAccessToken = function (data) {
  if (!(this instanceof ProviderAccessToken)) {
    return new ProviderAccessToken(data);
  }
  this.provider_access_token = data.provider_access_token;
  this.expires_in = data.expires_in;
};

/**
 * 根据 corpid、providersecret 创建API的构造函数。
 * 可在：https://qy.weixin.qq.com/cgi-bin/3rd_service?action=getlogin 看到以上两项。
 * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
 * 使用策略如下：
 *
 * 1. 调用用户传入的获取token的异步方法，获得token之后使用
 * 2. 使用appid/appsecret获取token。并调用用户传入的保存token方法保存
 *
 * Examples:
 * ```
 * var API = require('wechat-corp-service');
 * var apiProvider = new API.Provider('corpid','providersecret');
 * ```
 * 以上即可满足单进程使用。
 * 当多进程时，token需要全局维护，以下为保存token的接口。
 * ```
 * var apiProvider = new API.Provider('corpid','providersecret', function (callback) {
 *   // 传入一个获取全局token的方法
 *   fs.readFile('provider_access_token.txt', 'utf8', function (err, txt) {
 *     if (err) {return callback(err);}
 *     callback(null, JSON.parse(txt));
 *   });
 * }, function (token, callback) {
 *   // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
 *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
 *   fs.writeFile('provider_access_token.txt', JSON.stringify(token), callback);
 * });
 * ```
 * @param {String} corpid 在PaaS平台上申请得到的corpID
 * @param {String} providersecret 在PaaS平台上申请得到的providersecret
 * @param {Function} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
 * @param {Function} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
 */
var API = function (corpid, providersecret,getToken, saveToken) {
  this.corpid = corpid;
  this.providersecret = providersecret;
  this.store = null;
  this.getToken = getToken || function (callback) {
    callback(null, this.store);
  };
  this.saveToken = saveToken || function (token, callback) {
    this.store = token;
    if (process.env.NODE_ENV === 'production') {
      console.warn('Don\'t save token in memory, when cluster or multi-computer!');
    }
    callback(null);
  };
  this.prefix = 'https://qyapi.weixin.qq.com/cgi-bin/';
  this.defaults = {};
};


/**
 * 用于设置urllib的默认options
 *
 * Examples:
 * ```
 * api.setOpts({timeout: 15000});
 * ```
 * @param {Object} opts 默认选项
 */
API.prototype.setOpts = api_common.prototype.setOpts;

/**
 * 设置urllib的options
 *
 */
API.prototype.request = api_common.prototype.request;


/*!
 * 根据创建API时传入的corpid, providersecret获取suite access token
 * 进行后续所有API调用时，需要先获取access token
 * 详细请看：<http://qydev.weixin.qq.com/wiki/index.php?title=获取应用提供商凭证>
 *
 *
 * Examples:
 * ```
 * api.getProviderToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {"provider_access_token": "ACCESS_TOKEN",
 *  "expires_in": 7200 }
 * ```
 * @param {Function} callback 回调函数
 */

API.prototype.getProviderToken = function (callback) {
  var url = this.prefix + 'service/get_provider_token';
  var data = {
    corpid: this.corpid,
    provider_secret: this.providersecret
  };
  var that = this;
  this.request(url, postJSON(data), wrapper(function (err, data) {
    if (err) {
      return callback(err);
    }
    var token = ProviderAccessToken(data);
    that.saveToken(token, function (err) {
      if (err) {
        return callback(err);
      }
      callback(err, token);
    });
  }));

  return this;
};


/*!
 * generateAuthUrl
 * 拼装出第三方授权用的URL
 * 可在：https://qy.weixin.qq.com/cgi-bin/3rd_service?action=getlogin 用微信生成好的按钮组件。
 * Examples:
 * ```
 * api.generateAuthUrl(redirectUri, state);
 * ```
 *
 */


API.prototype.generateAuthUrl = function (redirectUri, state) {
  return 'https://qy.weixin.qq.com/cgi-bin/loginpage?corp_id=' + this.corpid +
    redirectUri + "&state=" + state;
};



/**
 * 获取最新的token。
 *
 * - 如果还没有请求过token，则发起获取Token请求。
 * - 如果请求过，则调用getToken从获取之前保存的token
 *
 * Examples:
 * ```
 * api.getLatestToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `token`, 获取的token
 *
 * @param {Function} callback 回调函数
 */
API.prototype.getLatestToken = function (callback) {
  var that = this;
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  that.getToken(function (err, token) {
    if (err) {
      return callback(err);
    }
    // 有token
    if (token) {
      callback(null, ProviderAccessToken(token));
    } else {
      that.getProviderToken(callback);
    }
  });
};


API.prototype.getLoginInfo = function (auth_code,callback) {
  var that = this;
  that.getLatestToken(function (err, token) {
    if (err) {
      return callback(err);
    }
    var url = that.prefix + 'service/get_login_info?provider_access_token='+token.provider_access_token;
    var data = {
      "auth_code" : auth_code
    }

    that.request(url, postJSON(data), wrapper(callback));
  });
};


/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
  for (var key in obj) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: '+ key);
    }
    API.prototype[key] = obj[key];
  }
};

API.providerToken = ProviderAccessToken;

module.exports = API;





