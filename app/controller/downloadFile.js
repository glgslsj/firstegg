'use strict';

const path = require('path');
const fs = require('fs');
const Controller = require('egg').Controller;

class IndexController extends Controller {
    async download() {
        // 下载的post接口
        this.ctx.logger.info(this.ctx.request.body)
        let filename = this.ctx.request.body.filename
        const filePath = path.resolve('./app/public/upload', this.ctx.request.body.filename);
        this.ctx.attachment(filename);
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.body = fs.createReadStream(filePath);
    }
    async getdownload() {
        // 下载的get接口
        this.ctx.logger.info(this.ctx.request.query)
        let filename = this.ctx.request.query.filename
        const filePath = path.resolve('./app/public/upload', this.ctx.request.query.filename);
        this.ctx.attachment(filename);
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.body = fs.createReadStream(filePath);
    }
}

module.exports = IndexController;
