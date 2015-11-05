var API = require('./lib/api_common');
// 第三方应用接口
API.mixin(require('./lib/api_service'));
module.exports = API;
