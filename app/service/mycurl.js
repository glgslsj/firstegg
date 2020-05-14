const Service = require('egg').Service;
const FormData = require('form-data');
const FormStream = require('formstream');
const path = require('path');
const fs = require('fs');

class NewsService extends Service {
    // 这是全局的curl，post
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
    // 这是全局的curl，get
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
    // 发送文件给query里的url，这里主要是给图片保存外链。
    async postfile(params) {
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
    // 发送文件给后端保存
    async savefile(params) {
        this.ctx.logger.info(params);
        // 上传基础目录
        const uplaodBasePath = 'app/public/upload/';
        // 生成文件名
        const filename = Date.now() + '' + Number.parseInt(Math.random() * 10000) + path.extname(params.content.filename);
        // 生成文件夹
        const target = path.join(this.config.baseDir, uplaodBasePath, filename);
        // 写入流
        const writeStream = fs.createWriteStream(target);
        let stream = fs.createReadStream(params.content.filepath);
        await stream.pipe(writeStream);
        return {
            filename:filename
        }
    }
}

module.exports = NewsService;
