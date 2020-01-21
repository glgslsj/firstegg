const Controller = require('egg').Controller;

class confirmIdController extends Controller {
    // 这个接口需要传入一个{account:$username,ep:$password}的数据进行判断是否有这个用户，暂时这样，要改成增加一个时间戳加密判断更好
    // 这里还需要传入一个密码的id，用来获取数据库存的密码
    async index() {
        const ctx = this.ctx;
        let result = false
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
        const userRes = await this.ctx.curl(hasuraUrl, options)
        let user = userRes.data.data.user
        ctx.logger.info(user)
        if (user.length === 1){
            if (user[0].password === postData.ep) {
                let passwordOptions = {
                    method: 'POST',
                    data: {
                        variables:{userName:postData.account,id:postData.id},
                        query:`query q($userName:String,$id:Int) { 
                            passwordRe(order_by: {created_at: asc}, where: {owner: {_eq: $userName}, id: {_eq: $id}}) {
                            passwordEnciphered
                            id
                            }
                            }` }, // 这里的query后面必须跟一个名字
                    headers:{ 'Content-Type': 'application/json', 'x-hasura-admin-secret': '333'},
                    dataType: 'json',
                }
                const dontF = await this.ctx.curl(hasuraUrl, passwordOptions)
                result = {
                    result:true,
                    message:dontF.data.data
                }
            }
        }
        ctx.body = {
            data:result
        };
        ctx.status = 201;
        // 设置响应体和状态码
    }
}
module.exports = confirmIdController;
