const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
};

class curlController extends Controller {
    async index() {
        const ctx = this.ctx;
        const content = ctx.request.body
        var result = {}
        if (content.hasOwnProperty('method')&&content.method === 'post'){
            result = await ctx.service.mycurl.post(content);
        }else {
            result = await ctx.service.mycurl.get(content);
        }
        // 设置响应体和状态码
        ctx.body = {
            data:result
        };
        ctx.status = 201;
    }
}
module.exports = curlController;
