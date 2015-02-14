var ee = require('vflow-pouchdb');
var h = require('vbridge').h;
var page = require('page');

function profile(state) {

  ee.on('profile:get-edit-response', function(doc) {
    console.log('edit response');
    state.set('profile', doc.object);
    state.set('ref', 'editProfile');
  });

  ee.on('profile:updated', function(doc) {
    page.redirect('/profiles/' + doc.object._id + '/show');
  });

  page('/profiles/:id/edit', function(ctx) {
    ee.emit('post', {
      object: {
        type: 'profile',
        _id: ctx.params.id
      },
      verb: 'get-edit'
    });
    // show spinner?    
  });

  page('/profiles/:id/update', function(ctx) {
    ee.emit('post', {
      verb: 'update',
      object: ctx.body,
      actor: null
    })
  });
}

function render(state) {
  var profile = state.get('profile');
  return h('div', [
    h('.row', [
      h('.twelve.columns', [
        h('form', { action:'/profiles/' + profile._id + '/update', method: 'POST'}, [
          h('input', { type: 'hidden', name: '_id', value: profile._id }),
          h('input', { type: 'hidden', name: '_rev', value: profile._rev }),
          h('input', { type: 'hidden', name: 'type', value: 'profile'}),
          h('fieldset', [
            h('label', 'Name'),
            h('input.u-full-width', {type: 'text', name: 'name', value: profile.name })  
          ]),
           h('fieldset', [
            h('label', 'Email'),
            h('input.u-full-width', {type: 'text', name: 'email'})  
          ]),
          h('fieldset', [
            h('label', 'Summary'),
            h('textarea.u-full-width', {name: 'summary'})  
          ]),
          h('fieldset', [
            h('label', 'twitter'),
            h('input.u-full-width', {type: 'text', name: 'twitter'})  
          ]),
          h('fieldset', [
            h('label', 'github'),
            h('input.u-full-width', {type: 'text', name: 'github'})  
          ]),
          h('fieldset', [
            h('label', 'skills'),
            h('input.u-full-width', {type: 'text', name: 'skill'})  
          ]),          
          h('input.button.button-primary', { type: 'submit', value: 'Update Profile' } )
        ])
      ])
    ])
  ])
}

profile.render = render;
module.exports = profile;