var ee = require('vflow-pouchdb');
//var ee = require('../changes');

var pouchdb = require('pouchdb');
var profiles = pouchdb('ifile_profiles');

module.exports = function () {
  function get(req) {
    return function(doc) {
      profiles.get(doc.object._id)
        .then(function(result) {
          var e = {
            object: result,
            verb: 'get-' + req + '-response'
          };
          ee.emit('post', e);
        });
    }
  }
  ee.on('profile:get-show', get('show'));
  ee.on('profile:get-edit', get('edit'))
  ee.on('profile:query', function(doc) {
    if (doc.object.criteria === '*') {
      profiles.allDocs({include_docs: true})
        .then(function(results) {
          var docs = results.rows.map(function(row) {
            return row.doc;
          });
          ee.emit('post', {
            object: {
              type: 'profile',
              docs: docs
            },
            verb: 'query-response'
          });
        }, function(err) {
          console.log(err);
        });
    }
  });

  ee.on('profile:create', function(doc) {
    profiles.post(doc.object)
      .then(function(res) {
        doc.object._id = res.id;
        var e = {
          verb: 'created',
          object: doc.object
        };
        ee.emit('profile:created', e);
      });
  });

  ee.on('profile:update', function(doc) {
    profiles.put(doc.object) 
      .then(function(res) {
        ee.emit('profile:updated', { 
          verb: 'updated',
          object: doc.object
        });
      }, function(err) {
        console.log(err);
      });
  });
};