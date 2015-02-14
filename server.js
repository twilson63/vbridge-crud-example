var pkg = require('./package.json');
var http = require('http');
var ecstatic = require('ecstatic');
var h = require('hyperscript');

http.createServer(function(req, res) {
 
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
