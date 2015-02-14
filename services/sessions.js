var dbUrl = process.env.COUCH_URL || 'http://127.0.0.1:5984';
var pouchdb = require('pouchdb');
pouchdb.plugin(require('pouchdb-authentication'));

var session = pouchdb(dbUrl + '/_session');
var stream = pouchdb(dbUrl + '/devbase')

module.exports = function() {
  stream.changes({
    include_docs: true,
    since: 'now',
    live: true
  })
  .on('change', function(change) {
    if (change.doc.object.type === 'session' && change.doc.verb === 'create') {
      var s = change.doc.object;
      console.log(change.doc.object);
      
      session.login(s.name, s.password, function(err, res) {
        if (err) { return console.log(err); }
        console.log(res);
        stream.post({
          object: {
            type: 'session'
          },
          verb: 'created'
        });
      });  
    }
  });
};