var dbUrl = process.env.COUCH_URL || 'http://127.0.0.1:5984';
var ee = require('../flow');
var pouchdb = require('pouchdb');
var profiles = pouchdb(dbUrl + '/profiles');

module.exports = function() {
  function get(req) {
    return function(doc) {
      profiles.get(doc.object._id)
        .then(function(result) {
          var e = {
            object: result,
            verb: 'get-' + req + '-response',
            actor: doc.actor,
            systemId: doc.systemId
          };
          ee.emit('post', e);
        });
    }
  }
  ee.on('profile:get-show', get('show'));
  ee.on('profile:get-edit', get('edit'))
  ee.on('profile:query', function(doc) {
    profiles.allDocs({include_docs: true})
      .then(function(results) {
        var docs = [];
        var rows = results.rows;
        if (doc.object.criteria !== '*') {
          rows = results.rows.filter(function(row) {
            return row.doc.name.indexOf(doc.object.criteria) > -1 ? true : false
          });
        }

        docs = rows.map(function(row) {
          row.doc.skills = row.doc.skills ? row.doc.skills : [];
          return row.doc;
        });  
        var qryResults = {
          object: {
            type: 'profile',
            docs: docs
          },
          verb: 'query-response',
          actor: doc.actor,
          systemId: doc.systemId
        };
        ee.emit('post', qryResults); 

      }, function(err) {
        ee.emit('post', {
          verb: 'error',
          object: {
            type: 'profile',
            message: ''
          },
          actor: doc.actor,
          systemId: doc.systemId
        });
      });
  });

  ee.on('profile:create', function(doc) {
    doc.object.skills = doc.object.skills ? [] : doc.object.skills.split(',');

    profiles.post(doc.object)
      .then(function(res) {
        doc.object._id = res.id;
        var e = {
          verb: 'created',
          object: doc.object,
          actor: doc.actor,
          systemId: doc.systemId
        };
        ee.emit('post', e);
      });
  });

  ee.on('profile:update', function(doc) {
    doc.object.skills = doc.object.skills.split(',');

    profiles.put(doc.object) 
      .then(function(res) {
        ee.emit('post', { 
          verb: 'updated',
          object: doc.object,
          actor: doc.actor,
          systemId: doc.systemId
        });
      }, function(err) {
        console.log(err);
      });
  });

  ee.on('profile:remove', function(doc) {
    profiles.remove(doc.object._id, doc.object._rev)
      .then(function(res) {
        ee.emit('post', {
          verb: 'removed',
          object: res,
          actor: doc.actor,
          systemId: doc.systemId
        });
      });
  });
};
