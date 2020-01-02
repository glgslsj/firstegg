const Controller = require('egg').Controller;
const fs = require('fs')

var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "15910661";
var API_KEY = "B0U19FOPOnxE5G58A3uuwLZc";
var SECRET_KEY = "PGkpt35HfjqpkAjeZqbNPV11RqlWlPNG";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

class speechController extends Controller {
    async index() {
        const ctx = this.ctx;
        var voice = ''
        var voiceBase64 = ''
        var isfile = false
        var result = {}
        var query = ctx.request.query
        if (ctx.request.files) {
            voice = fs.readFileSync(ctx.request.files[0].filepath);
            voiceBase64 = new Buffer(voice);
            isfile = true
        } else {
            // 这个path是以根目录算的
            voice = fs.readFileSync('./testfile/16k_test.pcm');
            voiceBase64 = new Buffer(voice);
        }
       await client.recognize(voiceBase64, query.format,8000).then(function(res) {
            ctx.logger.info('语音识别结果: ' + JSON.stringify(res));
            result = res
        }, function(err) {
            result = err
        });
        ctx.body = {
            data:result
        };
        ctx.status = 201;
        // 设置响应体和状态码

    }
}
module.exports = speechController;
