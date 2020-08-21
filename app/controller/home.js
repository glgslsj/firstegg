const Controller = require('egg').Controller;
const store = require('store2')

class HomeController extends Controller {
    async index() {
        const { app, ctx } = this;
        var content = 'helloworld'
        /*const mailOptions = {
            from: '1109833087@qq.com',
            to: '359718689@qq.com',
            subject: 'hello world',
            html: `<div>点击链接进行验证</div>`
        };

        app.email.sendMail(mailOptions, (error, response) => {
            if (error) {
                ctx.logger.info(error);
                content = error
                ctx.body = content;
                ctx.status = 201;
            } else {
                ctx.logger.info(response.message);
                content = response.message
                ctx.body = content;
                ctx.status = 201;
            }
            app.email.close();
        });*/
        ctx.body = store('incrementing_no');
        ctx.status = 201;
    }
    test(ctx){
        if(store('incrementing_no')===null){
            store('incrementing_no',101)
        }
        let no = store('incrementing_no')+1
        store('incrementing_no',no)
        ctx.body = store('incrementing_no')
        ctx.status = 201;
    }
}

module.exports = HomeController;
