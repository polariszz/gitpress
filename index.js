var http = require('http'),
    httpProxy = require('http-proxy');
var repos;

if(!process.argv[2]){
	console.log('node gitpress user/repo [port=8000]\n');
	process.exit(0);
}else{
	repos = process.argv[2].split('/');
	if(repos.length <= 1){
		repos.push('blog');
	}
	//console.log(repos);
	//process.exit(0);
	global.gitpressUser = repos[0];
	global.gitpressRepo = repos[1];
}

var port = process.argv[3] || 8000;

var fs = require('fs');

//加载模板
var template_root = __dirname + '/www/static/';
var templates = ['default', 'slate', 'tactile'];
var target_root = __dirname + '/app/Tpl/Home/';

templates.forEach(function(tpl){
	var templateFile = template_root + tpl + '/index.html';

	var targetFile = target_root + 'index_' + tpl + '.html';
	if(!fs.existsSync(targetFile)){
		console.log('link targetFile:' + targetFile);
		fs.symlinkSync(templateFile, targetFile);
	}
});

require('./www/index.js');

//
// Create your proxy server
//
httpProxy.createServer(function (req, res, proxy) {
  //
  // Put your custom server logic here
  //
  req.headers['proxy-x-gitpress'] = repos.toString();
  proxy.proxyRequest(req, res, {
    host: 'localhost',
    port: 8360
  });
}).listen(8000);

console.log('Proxy run at ' + port 
	+ '\nThe repo is:' + repos.join('/'));
