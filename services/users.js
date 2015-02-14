var dbUrl = process.env.COUCH_URL || 'http://127.0.0.1:5984';
var pouchdb = require('pouchdb');
var users = pouchdb(dbUrl + '/_users');
var stream = pouchdb(dbUrl + '/devbase')

module.exports = function() {
  console.log('listening...');
  stream.changes({
    include_docs: true,
    since: 'now',
    live: true
  })
  .on('change', function(change) {
    console.log('change');
    if (change.doc.object.type === 'user' && change.doc.verb === 'create') {
      var user = change.doc.object;
      user._id = "org.couchdb.user:" + user.name;
      user.roles = [];
      users.post(user)
      .then(function(res) {
        console.log(res);
        stream.post({
          object: user,
          verb: 'created'
        })
      }, function(err) {
        console.log(err);
      });  
    }
  });
};