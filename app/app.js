require('./css');

var app = require('vbridge');
var h = app.h;
var page = require('page');
var pageBodyParser = require('page-body-parser');

var state = app.state({
  title: 'DevBase',
  ref: 'login',
  profiles: []
});

// load services
//require('services/profiles')();
require('services/users')();
require('services/sessions')();

// load components
var authComponent = require('components/auth')
var loginComponent = require('components/login');
var signupComponent = require('components/signup');

var searchComponent = require('components/search');
var newProfileComponent = require('components/new-profile');
var showProfileComponent = require('components/show-profile');
var editProfileComponent = require('components/edit-profile');

[ authComponent, loginComponent, signupComponent, searchComponent, 
  newProfileComponent, showProfileComponent, editProfileComponent ]
  .map(function(init) {
    init(state);
  });

// init router
page();
pageBodyParser();

// init app
app(document.body, state, render);

function render(state) {
  var components = {
    "login": loginComponent.render,
    "signup": signupComponent.render,
    "search": searchComponent.render,
    "newProfile": newProfileComponent.render,
    "showProfile": showProfileComponent.render,
    "editProfile": editProfileComponent.render
  };

  return h('div.container', [
    h('header.container', [
      authComponent.render(state),
      h('h1.title', [state.get('title')])
    ]),
    h('.container', [
      components[state.get('ref')](state)
    ])
  ]);
}