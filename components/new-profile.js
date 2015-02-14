var ee = require('vflow-pouchdb');
//var ee = require('../changes');


var h = require('vbridge').h;
var page = require('page');

function profile(state) {
  ee.on('profile:created', function(doc) {
    page.redirect('/');
  });

  page('/profiles/new', function(ctx) {
    state.set('ref', 'newProfile');
  });

  page('/profiles/create', function(ctx) {
    ctx.body.type = 'profile';
    ee.emit('post', {
      verb: 'create',
      object: ctx.body,
      actor: null
    })
  });
}

function render(state) {
  return h('div', [
    h('.row', [
      h('.twelve.columns', [
        h('form', { action:'/profiles/create', method: 'POST'}, [
          h('input', { type: 'hidden', value: 'profile'}),
          h('fieldset', [
            h('label', 'Name'),
            h('input.u-full-width', {type: 'text', name: 'name'})  
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
          h('input.button.button-primary', { type: 'submit', value: 'Create Profile' } )
        ])
      ])
    ]),
    h('.row', [
      h('.twelve.columns', [
        h('a', { href: '/profiles/new'}, ['New Profile'])
      ])
    ])
  ])
}

profile.render = render;
module.exports = profile;