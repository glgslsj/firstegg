const Service = require('egg').Service;
const {exec} = require('child_process');

class NewsService extends Service {
    async index(params) {
        this.ctx.logger.info('hi');
        exec('my.cmd'
            , (error, stdout, stderr) => {
                if (error) {
                    this.ctx.logger.info(error);
                    return 'error';
                }
                this.ctx.logger.info(`stdout: ${stdout}`);
                this.ctx.logger.info(`stderr: ${stderr}`);
                return 'done'
            });
    }
}

module.exports = NewsService;
