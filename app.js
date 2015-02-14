require('./css');

var app = require('vbridge');
var h = app.h;
var page = require('page');
var pageBodyParser = require('page-body-parser');

var state = app.state({
  title: 'Devs',
  ref: 'search',
  profiles: []
});

// load services
require('./services/profiles')();

// load components
var searchComponent = require('./components/search');
searchComponent(state);
var newProfileComponent = require('./components/new-profile');
newProfileComponent(state);
var showProfileComponent = require('./components/show-profile');
showProfileComponent(state);
var editProfileComponent = require('./components/edit-profile');
editProfileComponent(state);

// init router
page();
pageBodyParser();

// init app
app(document.body, state, render);

function render(state) {
  var components = {
    "search": searchComponent.render,
    "newProfile": newProfileComponent.render,
    "showProfile": showProfileComponent.render,
    "editProfile": editProfileComponent.render
  };

  return h('div.container', [
    h('header', [
      h('h1.title', ['iFiles'])
    ]),
    components[state.get('ref')](state)
  ]);
}