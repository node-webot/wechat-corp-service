var API = require('./lib/api_common');
var api_provider = require('./lib/api_provider');
// 第三方应用接口
API.mixin(require('./lib/api_service'));
API.Provider = api_provider;
module.exports = API;
