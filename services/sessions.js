var dbUrl = process.env.COUCH_URL || 'http://127.0.0.1:5984';
var pouchdb = require('pouchdb');
var sessions = pouchdb(dbUrl + '/_session');
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
      sessions.post({name: s.name, password: s.password })
      .then(function(res) {
        console.log(res);

        stream.post({
          object: {
            type: 'session'
          },
          verb: 'created'
        })
      });  
    }
  });
};