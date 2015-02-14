var EventEmitter = require('events').EventEmitter, ee;

module.exports = function(dbname) {
  ee = (ee = global.ee) != null ? ee : new EventEmitter();

  var pouchdb = require('pouchdb');
  var stream = pouchdb(dbname);

  stream.changes({
    include_docs: true,
    since: 'now',
    live: true
  }).on('change', function(change) {
    var key = [change.doc.object.type, change.doc.verb].join(':'); 
    ee.emit(key, change.doc);
  });

  // always create new event on stream
  ee.on('post', stream.post);

  return ee;
}
