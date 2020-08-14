const Controller = require('egg').Controller;

class HasuraActionController extends Controller {
    async index() {
        const { app, ctx } = this;
        const { username } = ctx.request.body.input;
        var content = {token:username}
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
        ctx.body = content;
        ctx.status = 201;
    }
    async login() {
        const ctx = this.ctx;
        let result = false
        let postData = ctx.request.body
        let options = {
            method: 'POST',
            data: {
                variables: {userName: postData.username},
                query: `query q($userName:String) { 
         user(where: {userName: {_eq: $userName}}) {
          role
          nickName
          userName
          password
        }
      }`
            }, // 这里的query后面必须跟一个名字
            headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': '333'},
            dataType: 'json',
        }
        let hasuraUrl = 'http://112.126.102.214:8080/v1/graphql'
        const userRes = await this.ctx.curl(hasuraUrl, options)
        let user = userRes.data.data.user
        if (user&&user.length>0) {
            result = {token:user[0].role}
        }
        ctx.body = {
            data:result
        };
        ctx.status = 201;
    }
}

module.exports = HasuraActionController;
