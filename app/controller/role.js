const Controller = require('egg').Controller;
const fs = require('fs')

class roleController extends Controller {
    async index() {
        const ctx = this.ctx;
        let result = 'role'
        ctx.body = {
            data:result
        };
        ctx.status = 201;
        // 设置响应体和状态码
    }
}
module.exports = roleController;
