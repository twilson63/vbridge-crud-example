var ee = require('vflow-pouchdb');


var h = require('vbridge').h;
var page = require('page');

function profile(state) {
  ee.on('profile:get-show-response', function(doc) {
    state.set('profile', doc.object);
    state.set('ref', 'showProfile');
  });

  page('/profiles/:id/show', function(ctx) {
    ee.emit('post', {
      object: {
        type: 'profile',
        _id: ctx.params.id
      },
      verb: 'get-show'
    });
    // show spinner?    
  });
}

function render(state) {
  var profile = state.get('profile');
  return h('div', [
    h('.row', [
      h('.twelve.columns', [
        h('h1', profile.name)
      ])
    ]),
    h('.row', [
      h('.twelve.columns', [
        h('ul', [
          h('li', [
            h('a', {href: '/profiles/' + profile._id + '/edit'}, ['Edit'])
          ]),
          h('li', [
            h('a', { href: '/'}, ['Return'])
          ])
        ])
      ])
    ])
  ])
}

profile.render = render;
module.exports = profile;