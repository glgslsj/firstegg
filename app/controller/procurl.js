const Controller = require('egg').Controller;

class curlController extends Controller {
    async index() {
        const ctx = this.ctx;
        var content = ''
        var result = {}
        var isfile = false
        var query = ctx.request.query
        if (ctx.request.hasOwnProperty('files')&&ctx.request.files) {
            content = ctx.request.files[0]
            isfile = true
        } else {
            content = ctx.request.body
        }
        if (content.hasOwnProperty('method')&&content.method === 'post'||query.hasOwnProperty('method')&&query.method==='post'){
            if (isfile) {
                // this.ctx.logger.info(1);
                if (query.url==='https://sm.ms/api/upload') {
                    // this.ctx.logger.info(2);
                    // 如果是向sm.ms发送图片，则
                    result = await ctx.service.mycurl.postfile({content:content, query:query})
                }else {
                    // this.ctx.logger.info(3);
                    // 保存文件
                result = await ctx.service.mycurl.savefile({content:content, query:query})
                }
            }
            else {
                // curl的post方法
                result = await ctx.service.mycurl.post({content:content, query:query});
            }
        }else {
            // curl的get方法
            result = await ctx.service.mycurl.get({content:content, query:query});
        }
        // 设置响应体和状态码
        ctx.body = {
            data:result
        };
        ctx.status = 201;
    }
}
module.exports = curlController;
