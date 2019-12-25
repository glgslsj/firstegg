const Service = require('egg').Service;

class NewsService extends Service {
    async post(params) {
        const result = await this.ctx.curl(params.url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            data: params.hasOwnProperty('data')?params.data:{},
            headers:params.hasOwnProperty('headers')?params.headers:{contentType: 'json'},
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
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
