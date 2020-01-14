const Controller = require('egg').Controller;
const fs = require('fs')

class roleController extends Controller {
    async index() {
        const ctx = this.ctx;
        let result = false
        let userMessage = {}
        let postData = ctx.request.body
        let options = {
            method: 'POST',
            data: {
                variables:{userName:postData.account},
                query:`query q($userName:String) { 
         user(where: {userName: {_eq: $userName}}) {
          role
          nickName
          userName
          password
        }
      }` }, // 这里的query后面必须跟一个名字
            headers:{ 'Content-Type': 'application/json', 'x-hasura-admin-secret': '333'},
            dataType: 'json',
        }
        let hasuraUrl ='http://112.126.102.214:8080/v1/graphql'
        const hasuraRes = await this.ctx.curl(hasuraUrl, options)
        let user = hasuraRes.data.data.user
        if (user.length === 1){
            if (user[0].password === postData.ep) {
                result = true
                userMessage = {
                    userName:user[0].userName,
                    nickName:user[0].nickName,
                    role:user[0].role
                }
            }
        }
        ctx.body = {
            data:result,
            userMessage:userMessage
        };
        ctx.status = 201;
        // 设置响应体和状态码
    }
}
module.exports = roleController;
