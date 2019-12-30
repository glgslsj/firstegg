const Service = require('egg').Service;
const FormData = require('form-data');
const FormStream = require('formstream');

class NewsService extends Service {
    async post(params) {
        var isQuery = params.query.hasOwnProperty('headers')
        var url = isQuery?params.query.url:params.content.url
        var hasHeader = params.query.hasOwnProperty('headers')||params.content.hasOwnProperty('headers')
        var options = {
            method: 'POST',
            data:isQuery?params.content:params.content.hasOwnProperty('data')?params.content.data:{},
            headers:hasHeader&&isQuery?params.query.headers:hasHeader?params.content.headers:{},
            dataType: 'json',
        }
        const result = await this.ctx.curl(url, options
        ).catch(e=>{
            this.ctx.logger.info(e);
        });
        return result.data
    }
    async get(params) {
        let options = {
            method: 'get',
            headers:params.content.hasOwnProperty('headers')?params.content.headers:{contentType: 'json'},
            dataType: 'json',
        }
        if (params.query) {
            Object.assign(options,params.query)
        }
        const result = await this.ctx.curl(params.content.url, options);
        return result.data
    }
    async postfile(params) {
        this.ctx.logger.info(e);
        var filepath = params.content.filepath
        var fieldname = params.content.fieldname
        const form = new FormStream()
        form.file('smfile', filepath);
        const result = await this.ctx.curl(params.query.url, {
            method: 'post',
            headers: form.headers(),
            stream:form,
            dataType: 'json',
        });
        return result.data
    }
}

module.exports = NewsService;
