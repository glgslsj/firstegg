const Service = require('egg').Service;

class NewsService extends Service {
    async index(params) {
        this.ctx.logger.info('request data: %j', params);
        const data = await this.ctx.curl(`http://112.126.102.214:8082`);
        return data.data
    }
}

module.exports = NewsService;
