const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
};

class curlController extends Controller {
    async index() {
        const ctx = this.ctx;
        var content = ctx.request.body
        var result = {}
        var formdata = await this.ctx.getFileStream()
        this.ctx.logger.info(formdata);
        if (content.hasOwnProperty('method')&&content.method === 'post'){
            this.ctx.logger.info(content);
            result = await ctx.service.mycurl.post(content);
        }else {
            this.ctx.logger.info(content,'curl');
            result = await ctx.service.mycurl.post(content);
        }
        // 设置响应体和状态码
        ctx.body = {
            data:result
        };
        ctx.status = 201;
    }
}
module.exports = curlController;
