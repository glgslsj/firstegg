module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.post('/api/curl', controller.curl.index);
    router.post('/api/more', controller.more.index);
    router.get('/api/more', controller.more.index);
};
