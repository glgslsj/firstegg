exports.keys ="firsteggkey";
exports.cors = {
    origin: "*",//匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};
exports.security = {
    csrf: {
        enable: false,
        type: 'ctoken',             // can be ctoken or referer or all, default to ctoken
        useSession: false,          // if useSession set to true, the secret will keep in session instead of cookie
        ignoreJSON: true,          // skip check JSON requests if ignoreJSON set to true
        cookieName: 'csrfToken',    // csrf token's cookie name
        sessionName: 'csrfToken',   // csrf token's session name
        headerName: 'x-csrf-token', // request csrf token's name in header
        refererWhiteList: ['http://localhost:8080'],       // referer white list
    }
};
exports.email = {
    client: {
        host: 'smtp.qq.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: '1109833087',
            pass: 'lsj19891'
        }
    }
};
// exports.middleware = [ 'formidable' ];

exports.bodyParser = {
    jsonLimit: '100mb',
    formLimit: '100mb'
};
exports.multipart = { mode: "file", fileSize: "600mb",fileExtensions :['amr'] };

