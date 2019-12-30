const Controller = require('egg').Controller;
const FormData = require('form-data');
const fs = require('fs');

// 定义创建接口的请求参数规则
const createRule = {
};
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

class curlController extends Controller {
    async index() {
        const ctx = this.ctx;
        var content = ''
        var isfile = false
        if (ctx.request.files) {
            content = ctx.request.files[0]
            isfile = true
        }
        content = ctx.request.body
        var result = {}
        var query = ctx.request.query
        if (content.hasOwnProperty('method')&&content.method === 'post'||query.hasOwnProperty('method')&&query.method==='post'){
            result = await ctx.service.mycurl.post({content:content, query:query,isfile:isfile});
            /*var formdata = new FormData()
            var filebuffer = fs.createReadStream('./baymax.jpg')
            // var bolb = new Bolb([filebuffer],{type : 'image/jpg'})
            formdata.append('smfile',filebuffer)
            result = await this.ctx.curl(query.url, {
                // 必须指定 method
                method: 'POST',
                // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
                data:formdata,
                headers:{'Content-Type': 'multipart/form-data'},
                contentType:'multipart/form-data',
                // headers:query.hasOwnProperty('headers')?query.headers:{contentType: 'json'},
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            }
            ).catch(e=>{
                this.ctx.logger.info(e);
            });*/
        }else {
            result = await ctx.service.mycurl.get({content:content,  query:query});
        }
        // 设置响应体和状态码
        ctx.body = {
            data:result
        };
        ctx.status = 201;

    }
}
module.exports = curlController;
