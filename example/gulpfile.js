// Include gulp
var gulp = require('gulp')
    modules = require('gulp-web-modules'),
    react = require('gulp-react');

modules({
  foo: 'bar',
  beforeBrowserify: function() {
    // compile all .jsx modules to javascript
    return react();
  },
  devServer: {
    mocks: {
      prefix: '/services/'
    }
  }
}).injectTasks(gulp);
