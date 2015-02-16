var EventEmitter = require('events').EventEmitter, ee;
ee = module.exports = (ee = global.ee) != null ? ee : new EventEmitter();

var pouchdb = require('pouchdb');
var stream = pouchdb(window.location.origin + '/db');

var uuid = require('node-uuid');

var systemId = window.localStorage.getItem('systemId') || uuid.v4();
window.localStorage.setItem('systemId', systemId);


stream.changes({
  include_docs: true,
  since: 'now',
  live: true
}).on('change', function(change) {
  if (!change.doc.object) return; 
  if (!change.doc.object.type) return;
  
  var key = [change.doc.object.type, change.doc.verb].join(':'); 
  // if (key.indexOf('-response') > -1 && change.doc.systemId !== systemId) {
  //   //console.log(change.doc);
  //   return;
  // }
  console.log(key);
  console.log(change.doc.systemId);
  console.log(systemId);
  if (change.doc.systemId === systemId) ee.emit(key, change.doc);

});

// always create new event on stream
ee.on('post', function(p) {
  p.systemId = systemId;
  stream.post(p);
});
