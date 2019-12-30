const Service = require('egg').Service;
const FormData = require('form-data');
const fs = require('fs');

class NewsService extends Service {
    async post(params) {
        var isQuery = false
        var postdata = {}
        if (params.query.hasOwnProperty('headers')){
            isQuery = true
            postdata = params.content
            if (params.isfile) {
                var formdata = new FormData()
                var filebuffer = fs.createReadStream(params.content)
                var fileb = fs.readFileSync('./baymax.jpg')
                formdata.append('smfile',filebuffer)
                postdata = formdata
                this.ctx.logger.info(fileb,'fileb')
            }
        }
        if (isQuery) {
            const result = await this.ctx.curl(params.query.url, {
                // 必须指定 method
                method: 'POST',
                // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
                contentType:"multipart/form-data",
                data: postdata,
                headers:params.query.hasOwnProperty('headers')?params.query.headers:{contentType: 'json'},
                // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                dataType: 'json',
            }).catch(e=>{
                this.ctx.logger.info(e);
            });
            return result.data
        }
        const result = await this.ctx.curl(params.content.url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            data: params.content.hasOwnProperty('data')?params.content.data:postdata,
            headers:params.content.hasOwnProperty('headers')?params.content.headers:{contentType: 'json'},
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        }).catch(e=>{
            this.ctx.logger.info(e);
        });
        return result.data
    }
    async get(params) {
        const result = await this.ctx.curl(params.url, {
            // 必须指定 method
            method: 'get',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            headers:params.hasOwnProperty('headers')?params.headers:{contentType: 'json'},
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });
        return result.data
    }
}

module.exports = NewsService;
