const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { app, ctx } = this;
        var content = 'helloworld'
        this.ctx.body = content;
        ctx.status = 201;
    }
}

module.exports = HomeController;
