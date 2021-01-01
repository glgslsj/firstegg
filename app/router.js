module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);// helloworld，测试接口
    router.get('/test', controller.home.test);// helloworld，测试接口
    router.post('/api/curl', controller.procurl.index); // curl接口，跨域的接口
    router.post('/api/more', controller.more.index);// 部署的接口
    router.get('/api/more', controller.more.index);//  getmore的接口，暂时没用
    router.post('/api/speech', controller.speech.index); // 语音识别的接口
    router.post('/api/role', controller.role.index); // 身份判别的接口
    router.post('/api/download', controller.downloadFile.download);// 下载的post接口
    router.get('/api/download', controller.downloadFile.getdownload);// 下载的get接口
    router.get('/api/getpic', controller.downloadFile.getpic);// 下载的get接口
    router.post('/api/confirmId', controller.confirmId.index); // 本人判断并换密码的接口
    router.post('/api/tryaction', controller.hasuraAction.index); // 本人判断并换密码的接口
    router.post('/api/signUp', controller.tryLogin.signUp);// helloworld，测试接口
    router.post('/api/autoSignin', controller.tryLogin.autoSignin);// helloworld，测试接口
    router.post('/api/signIn', controller.tryLogin.signIn);// helloworld，测试接口
    router.post('/api/test', controller.tryLogin.test);// helloworld，测试接口
    router.get('/api/test', controller.tryLogin.test);// helloworld，测试接口
};
