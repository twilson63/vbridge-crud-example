var dbUrl = process.env.COUCH_URL || 'http://127.0.0.1:5984';
var pouchdb = require('pouchdb');
var sessions = pouchdb(dbUrl + '/_sessions');
var stream = pouchdb(dbUrl + '/devbase')

module.exports = function() {
  stream.changes({
    include_docs: true,
    since: 'now',
    live: true
  })
  .on('change', function(change) {
    if (change.doc.object.type === 'session' && change.doc.verb === 'create') {
      console.log('logging in');
      sessions.post(change.doc.object)
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