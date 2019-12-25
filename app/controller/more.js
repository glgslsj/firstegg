const Controller = require('egg').Controller;

class MoreController extends Controller {
    async index() {
        const ctx = this.ctx;
        const content = ctx.request.body
        var result = await ctx.service.exec.index(content);
        // 设置响应体和状态码
        ctx.body = {
            data:result
        };
        ctx.status = 201;
    }
}

module.exports = MoreController;
