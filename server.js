var pkg = require('./package.json');
var http = require('http');
var ecstatic = require('ecstatic');
var h = require('hyperscript');
var request = require('request');
var url = require('url');
var dbUrl = process.env.COUCH_URL || 'http://127.0.0.1:5984';

if (process.env.COUCH_URL) {
  request.put(process.env.COUCH_URL + '/devbase').pipe(process.stdout);
}

// var users = require('./services/users');
// users();
// var sessions = require('./services/sessions');
// sessions();

http.createServer(function(req, res) {
  console.log(req.url);
  if (req.url === '/_session') {
    req.pipe(request(url.resolve(dbUrl, req.url))).pipe(res);
    return;
  }
  if (req.url.indexOf('/_users') > -1 ) {
    req.pipe(request(url.resolve(dbUrl, req.url))).pipe(res);
    return;
  }
  if (req.url.indexOf('/db') > -1) {
    // couchdb forward proxy here
    var endpoint = req.url.replace('/db','/devbase');
    req.pipe(request(url.resolve(dbUrl, endpoint))).pipe(res);
    return;
  }

  function renderHome() {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(index());
  }
  ecstatic(pkg.env.ecstatic)(req, res, renderHome);
}).listen(process.env.PORT || 3000);



function index() {
  return h("html", [
    h("head", [
      h("meta", { 
        "charset": "utf-8"
      }),
      h("title", [ "DeveloperBase" ]),
      h("meta", { 
        "name": "viewport",
        "content": "width=device-width, initial-scale=1"
      }),
      h("link", { 
        "href": "//fonts.googleapis.com/css?family=Raleway:400,300,600",
        "rel": "stylesheet",
        "type": "text/css"
      })
    ]),
    h("body", [
      h("script", { "src": "/bundle.js" })
    ])
  ]).outerHTML;
}
