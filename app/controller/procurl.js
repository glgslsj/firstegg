const Controller = require('egg').Controller;

class curlController extends Controller {
    async index() {
        const ctx = this.ctx;
        var content = ''
        var result = {}
        var isfile = false
        var query = ctx.request.query
        if (ctx.request.hasOwnProperty('files')&&ctx.request.files) {
            content = ctx.request.files[0]
            isfile = true
        } else {
            content = ctx.request.body
        }
        if (content.hasOwnProperty('method')&&content.method === 'post'||query.hasOwnProperty('method')&&query.method==='post'){
            if (isfile) {
                result = await ctx.service.mycurl.postfile({content:content, query:query})}
            else {
                result = await ctx.service.mycurl.post({content:content, query:query});
            }
        }else {
            result = await ctx.service.mycurl.get({content:content, query:query});
        }
        // 设置响应体和状态码
        ctx.body = {
            data:result
        };
        ctx.status = 201;
    }
}
module.exports = curlController;

/*addImage: async function () {
    // 上传图片的方法
    let input = document.createElement('input')
    input.type = 'file'
    input.onchange = async () => {
        let file = input.files[0]
        let formdata = new FormData()
        formdata.append('smfile', file)
        this.$tkAjax.post('http://localhost:8808/api/curl', formdata, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // 'Content-Type': 'multipart/form-data'
            },
            params: {
                url: 'https://sm.ms/api/upload',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        }).then(data => {
            let resdata = data.data.data
            if (resdata.success === true) {
                let storeObject = {
                    url: resdata.data.url,
                    delete: resdata.data.delete
                }
                // 保存图片的url
            }
        })
            .catch(e => {
                console.log(e, 'error')
            })
    }
    input.click()
}*/
