const Controller = require('egg').Controller;
// import * as jwt from ;
const jwt = require('jsonwebtoken');
const store = require('store2')

class TryLoginController extends Controller {
    generateUniqueId(incrementing_no) {
        let type = 1
        let batch = incrementing_no >= 1000000 ? 2 : 1
        let incrementno;
        if (incrementing_no < 1000000) {
            incrementno = incrementing_no
        } else if (incrementing_no >= 1000000 && incrementing_no < 1000100) {
            let noString = (100 + incrementing_no - 1000000).toString()
            let newNoString = '0' + noString[1] + noString[2]
            incrementno = newNoString
        } else {
            incrementno = incrementing_no - 1000000
        }
        let checksum = (incrementing_no % 10 + 1) % 10
        let all_outof_count = "" + type + batch + incrementno + checksum
        let count = all_outof_count.length
        let id = all_outof_count + count
        return id
    }

    async signUp() {
        const {app, ctx} = this;
        let jwtkey = '8YPncVonxi0afQGDbPfIfTpna5nFFIZ4';
        let output = {}
        const {user} = ctx.request.body.input;
        if (user.hero_exist === false) {
            let nowno=store('incrementing_no')
            let id = this.generateUniqueId(nowno)
            store('incrementing_no',nowno++)
            Object.assign(user, {unique_id: id})
            delete (user['hero_exist'])
            let options = {
                method: 'POST',
                data: {
                    variables: user,
                    query: `mutation MyMutation($first_name: String, $email: String, $country_code: String, $encrypted_password: String, $avatar: String, $last_good_deed: String, $last_name: String, $one_word_blurb: String, $phone: String, $profile_name: String, $unique_id: String) {
                  insert_user(objects: {avatar: $avatar, country_code: $country_code, email: $email, encrypted_password: $encrypted_password, first_name: $first_name, last_good_deed: $last_good_deed, last_name: $last_name, one_word_blurb: $one_word_blurb, phone: $phone, profile_name: $profile_name, userPings: {data: {}}, unique_id: $unique_id}) {
                    returning {
                      id
                      hero_authority
                    }
                  }
                }`
                }, // 这里的query后面必须跟一个名字
                headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': 'hero'},
                dataType: 'json',
            }
            let hasuraUrl = 'http://hasura.new-hero.mokekeji.com/v1/graphql'
            const hasuraRes = await this.ctx.curl(hasuraUrl, options)
            ctx.logger.info(hasuraRes);
            let res = hasuraRes.data.data.insert_user.returning[0]
            ctx.logger.info(res);
            const token = jwt.sign(
                {
                    "admin": true,
                    'https://hasura.io/jwt/claims': {
                        'x-hasura-allowed-roles': ['citizen', 'guest'],
                        'x-hasura-default-role': 'citizen',
                        'x-hasura-role': 'citizen',
                        'x-hasura-id' : res.id
                    },
                },
                jwtkey,
                // 第二个字段设置有效期为30天内
                {algorithm: 'HS256', expiresIn: '30 days'});
            output = {
                accessToken: token,
                hero_authority: res.hero_authority,
            }
        }  else {
            delete (user['hero_exist'])
            if (user.unique_id === '')
            {
                let id = globalutil.generateUniqueId(store.$private.get('user_incrementing_no'))
                user.unique_id = id
            }
            let options = {
                method: 'POST',
                data: {
                    variables: user,
                    query: `mutation MyMutation($first_name: String, $email: String, $country_code: String, $encrypted_password: String, $avatar: String, $last_good_deed: String, $last_name: String, $one_word_blurb: String, $phone: String, $profile_name: String, $unique_id: String) {
                                  update_user(_set: {avatar:$avatar,country_code:$country_code,email:$email,encrypted_password:$encrypted_password,first_name:$first_name,last_good_deed:$last_good_deed,last_name:$last_name,one_word_blurb:$one_word_blurb,phone:$phone,profile_name:$profile_name,unique_id:$unique_id}) {
                    returning {
                      hero_authority
                      unique_id
                    }
                  }
                }`
                }, // 这里的query后面必须跟一个名字
                headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': 'hero'},
                dataType: 'json',
            }
            let hasuraUrl = 'http://hasura.new-hero.mokekeji.com/v1/graphql'
            const update_res = await this.ctx.curl(hasuraUrl, options)
            let res = update_res.data.data.update_user.returning[0]
            const token = jwt.sign(
                {
                    "admin": true,
                    'https://hasura.io/jwt/claims': {
                        'x-hasura-allowed-roles': ['hero', 'citizen','guest'],
                        'x-hasura-default-role': 'hero',
                        'x-hasura-role': 'hero',
                        'x-hasura-id' : res.id
                    },
                },
                jwtkey,
                // 第二个字段设置有效期为30天内
                {algorithm: 'HS256', expiresIn: '30 days'});
            output = {
                accessToken: 'token',
                hero_authority: res.hero_authority,
            }
        }
        ctx.body = output;
        ctx.status = 201;
    }
    async autoSignin() {
        let verityJWT = function (JWT) {
            let jwtkey = '8YPncVonxi0afQGDbPfIfTpna5nFFIZ4';
            return jwt.verify(JWT, jwtkey, (err, payload) => {
                // if token alg != RS256,  err == invalid signature
                if (err) {
                    throw {desc: 'token errors', content: err, errCode: 102};
                }
                return payload;
            });
        };
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
            headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': 'hero'},
            dataType: 'json',
        }
        let hasuraUrl = 'http://hasura.new-hero.mokekeji.com/v1/graphql'
        const userRes = await this.ctx.curl(hasuraUrl, options)
        let user = userRes.data.data.user
        if (user && user.length > 0) {
            result = {token: user[0].role}
        }
        ctx.body = {
            data: result
        };
        ctx.status = 201;
    }

    signIn() {
        const {app, ctx} = this;
        let id = this.generateUniqueId(1000023)
        ctx.body = {
            data: id
        };
        ctx.status = 201;
    }

    async test() {
        const {app, ctx} = this;
        let jwtkey = '8YPncVonxi0afQGDbPfIfTpna5nFFIZ4';
        let output = {}
        const {user} = ctx.request.body.input;
        if (user.isExist === false) {
            delete(user['isExist']);
            let id = this.generateUniqueId(108)
            Object.assign(user, {unique_id: id})
            let options = {
                method: 'POST',
                data: {
                    variables: user,
                    query: `mutation MyMutation($first_name: String, $email: String, $country_code: String, $encrypted_password: String, $avatar: String, $last_good_deed: String, $last_name: String, $one_word_blurb: String, $phone: String, $profile_name: String, $unique_id: String) {
                  insert_user(objects: {avatar: $avatar, country_code: $country_code, email: $email, encrypted_password: $encrypted_password, first_name: $first_name, last_good_deed: $last_good_deed, last_name: $last_name, one_word_blurb: $one_word_blurb, phone: $phone, profile_name: $profile_name, userPings: {data: {}}, unique_id: $unique_id}) {
                    returning {
                      id
                      hero_authority
                    }
                  }
                }`
                }, // 这里的query后面必须跟一个名字
                headers: {'Content-Type': 'application/json', 'x-hasura-admin-secret': 'hero'},
                dataType: 'json',
            }
            let hasuraUrl = 'http://hasura.new-hero.mokekeji.com/v1/graphql'
            const hasuraRes = await this.ctx.curl(hasuraUrl, options)
            if (!hasuraRes.data.hasOwnProperty('data')) {
                output = {
                    accessToken: 'error',
                    id: 0,
                    hero_authority: false,
                }
                ctx.body = output;
                ctx.status = 201;
                return
            }
        // mutation的返回是这样的
            let res = hasuraRes.data.data.insert_user.returning[0]
            const token = jwt.sign(
                {
                    "admin": true,
                    'https://hasura.io/jwt/claims': {
                        'x-hasura-allowed-roles': ['citizen', 'guest'],
                        'x-hasura-default-role': 'citizen',
                        'x-hasura-role': 'citizen',
                        'x-hasura-id': res.id
                    },
                },
                jwtkey,
                // 第二个字段设置有效期为30天内
                {algorithm: 'HS256', expiresIn: '30 days'});
            output = {
                accessToken: token,
                id: res.id,
                hero_authority: res.hero_authority,
            }
        } else {
            output = {
                accessToken: 'token',
                id: 10,
                hero_authority: false,
            }
        }
        ctx.body = output;
        ctx.status = 201;
    }
}

module.exports = TryLoginController;
