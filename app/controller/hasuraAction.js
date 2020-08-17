const Controller = require('egg').Controller;
import * as jwt from 'jsonwebtoken';

class HasuraActionController extends Controller {
    /*verityJWT(JWT) {
        let jwtkey = '8YPncVonxi0afQGDbPfIfTpna5nFFIZ4';
        return jwt.verify(JWT, this.jwtkey, (err, payload) => {
            // if token alg != RS256,  err == invalid signature
            if (err) {
                throw { desc: 'token errors', content: err, errCode: 102 };
            }
            return payload;
        });
    }*/
    async index() {
        var jwtkey = '8YPncVonxi0afQGDbPfIfTpna5nFFIZ4';
        const { app, ctx } = this;
        const { username } = ctx.request.body.input.account;
        /*let content = {token:'username'}
        if (username){
            content.token = username
        }*/

        const token = jwt.sign(
            {
                'https://hasura.io/jwt/claims': {
                    'x-hasura-allowed-roles': [ 'admin','guest' ],
                    'x-hasura-default-role': 'admin',
                },
            },
            jwtkey,
            // 第二个字段设置有效期为30天内
            { algorithm: 'HS256', expiresIn: '30 days' });
        ctx.body = token;
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
