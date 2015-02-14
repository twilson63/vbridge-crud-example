var ee = require('vflow-pouchdb');
//var ee = require('../changes');

var h = require('vbridge').h;
var page = require('page');

function search(state) {
  // list all profile docs
  var e = {
    verb: 'query',
    object: {
      type: 'profile',
      criteria: '*'
    },
    actor: state.get('user')
  };
  
  ee.on('profile:query-response', function(o) {
    state.set('profiles', o.object.docs || [{name: 'beep'}]);
  });

  page('/', function(ctx) {
    setTimeout(function() { ee.emit('post', e); }, 10);
    state.set('ref', 'search');
  });

  page('/search', function(ctx) {
    e.criteria = ctx.body.criteria;
    ee.emit('post', e);
  });
}

// this could be a separate module
function render(state) {
  var profiles = state.get('profiles');

  function li(profile) {
    return h('li', [
      h('a', { href: '/profiles/' + profile._id + '/show' }, profile.name)
    ]);
  }

  return h('div', [
    h('.row', [
      h('.twelve.columns', [
        h('form', { action:'/search', method: 'POST'}, [
          h('input', {type: 'text', name: 'q'}),
          h('input.button.button-primary', { type: 'submit', value: 'Search' } )
        ])
      ])
    ]),
    h('.row', [
      h('.twelve.columns', [
        h('a', { href: '/profiles/new'}, ['New Profile'])
      ])
    ]),
    h('.row', [
      h('.twelve.columns', [
        h('ul', profiles.map(li))
      ])
    ])
  ])
}

search.render = render;
module.exports = search;