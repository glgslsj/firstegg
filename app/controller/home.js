const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { app, ctx } = this;
        var mycurl = await ctx.service.mycurl.index(ctx.request.body)
        ctx.logger.info('some request data: %j', mycurl);
        var content = JSON.parse(JSON.stringify(mycurl))
        this.ctx.body = content;
        ctx.status = 201;
    }
}

module.exports = HomeController;
