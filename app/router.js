module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);// helloworld，测试接口
    router.post('/api/curl', controller.procurl.index); // curl接口，跨域的接口
    router.post('/api/more', controller.more.index);// 部署的接口
    router.get('/api/more', controller.more.index);//  getmore的接口，暂时没用
    router.post('/api/speech', controller.speech.index); // 语音识别的接口
    router.post('/api/role', controller.role.index); // 语音识别的接口
};
