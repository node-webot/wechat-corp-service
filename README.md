wechat corp service 
====================

微信公共平台企业号版(第三方企业套件)SDK－主动调用接口


## 功能说明

企业第三方应用套件开发商向已经托管的应用发送过来的回调消息。

## 安装方法

```sh
$ npm install wechat-corp-service
```

## 使用方法

- 回调接口请移步: [微信公共平台企业号版(第三方企业套件)SDK－回调接口](https://github.com/node-webot/wechat-corp-service-callback)

### 前提

- 首先，你要有一个企业号。
- 然后，你要申请成为第三方企业套件的供应商。
- 接下来才可以创建套件，并且设置套件应用。
- 基于本SDK开发具体的套件应用。

### 用法

其中的token，encodingAESKey，suite_id可以在套件的信息配置界面获取。

```js
var APICorp = require('wechat-corp-service');

var app_suite = function(req, res, next) {
    var _config = {
        token: sc.token,
        encodingAESKey: sc.encodingAESKey,
        suiteid: sc.suite_id,
    };
    var _route = function(message, req, res, next) {
        
        if (message.InfoType == 'suite_ticket') { //微信服务器发过来的票，每10分钟发一次
            //更新到数据库
            var suite_ticket = message.SuiteTicket;
            var suite_ticket_tm = new Date(parseInt(message.TimeStamp) * 1000);
            //将最新的ticket放到数据库中, 调用用户自己定义的 save_ticket(callback) 方法。
             save_ticket(function(err, ret) {
                res.reply('success');
            });
        } else if (message.InfoType == 'change_auth') { //变更授权的通知
            //更新到数据库
            res.reply('success');

        } else if (message.InfoType == 'cancel_auth') { //取消授权的通知
            //更新到数据库
            res.reply('success');
        } else {
            res.reply('success');
        };
    }
    if (req.method == 'POST') {
        wechat_cs(_config, _route)(req, res, next);
    } else if (req.method == 'GET') {
        res.send('这个接口不适合GET');
    };
}

app.get(__base_path + '/app_suite_callback', app_suite);
app.post(__base_path + '/app_suite_callback', app_suite);
```

## 相关文档
- [微信企业号－第三方应用授权](http://qydev.weixin.qq.com/wiki/index.php?title=%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%94%E7%94%A8%E6%8E%88%E6%9D%83)


## License
The MIT license.

## 交流群
QQ群：157964097，使用疑问，开发，贡献代码请加群。

## 感谢
感谢以下贡献者：


## 捐赠
如果您觉得Wechat企业号版本对您有帮助，欢迎请作者一杯咖啡

![捐赠wechat](https://cloud.githubusercontent.com/assets/327019/2941591/2b9e5e58-d9a7-11e3-9e80-c25aba0a48a1.png)
