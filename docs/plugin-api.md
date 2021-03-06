Lifecycle Plugins
===============
There are many different events used to hook into the gulp pipeline with your own build requirements.  A plugin is used to access these events and perform build actions.

A plugin is simply a hash that contains any of the attributes described below.  Usually the module exports a function whih can accept plugin options and returns the plugin hash values.

Available Known Plugins
--------------
    * [gwm-config](https://github.com/jhudson8/gwm-config): copy build type specific config JSON to the base javascript file
    * [gwm-lib](https://github.com/jhudson8/gwm-lib): : copy all file content in a specific directory to gulp-web-modules base javascript file
    * [gwm-handlebars](https://github.com/jhudson8/gwm-handlebars): precompile all [handlebars](http://handlebarsjs.com/) templates
    * [gwm-stylus](https://github.com/jhudson8/gwm-stylus): compile all [stylus](http://learnboost.github.io/stylus/) files into css
    * [gwm-sass](https://github.com/jhudson8/gwm-sass): compile all [sass/scss](http://sass-lang.com/) files into css

Example plugin method
--------------
```javascript
    // options: the gulp options (see "options" section)
    // pipeline: the current gulp pipeline which *must* be returned 
    function(options, pipeline) {
      // hook into the pipeline
      pipeline = pipeline.pipe(...);

      return pipeline;
    }
  }
```

Options
-------------
    * entry: the section entry point javascript file ("index.js")
    * buildPath: the build path (shouldn't be used directly for sectional hooks)
    * srcPath: (section specific) the source path of the current section (eg: "/sections/foo/")
    * tmpPath: path used to store temporary files if that is required;  this should be avoided if possible
    * isBase: (section specific) true if the current section is the base section and false if not
    * section: (section specific) the name of the current section (eg: "foo")


Plugin Attributes
=================
The following are all of the attributes that are applicable for a section.  When appropriate, each attribute has an additional "Base" attribute which will only be applifed if the current section being processed is the base section.  Otherwise (for section specific attributes) they will be applied to any sections.

Each section has a unique javascript build and css build.  For each of these, available plugin attributes are:
* glob: this is not an event but an attribute that is used to identify specific file types that need to be included.  If this is present, all file types that you need should be included because all other files will be filtered out (meaning, if you still want .js files you should include that as well).  This value should be a string value or array of strings that represent a gulp [multimatch](https://github.com/sindresorhus/multimatch)
* watch: a multimatch string or array which includes all files to be watched for changes
* beforeMerge: execute before section files are joined into a single file (before browserify for the javascript build)
* afterMerge: execute after section files are joined into a single file (after browserify for the javascript build)
* complete: a little bit of required code is added after the files are merged (for javascript), this is executed after that javascript code is added (for css build this is the same as afterMerge)

Put it all together
==================
Here is an example of the *lib* plugin
```javascript
var fileHeader = require('./lib/file-header'),
    fs = require('fs');

module.exports = function(options) {
  options = options || {};
  var dir = options.dir || 'lib',
      priority = options.priority;

  return {
    javascript: {
      complete: function(_options, pipeline) {
        var dirPath = _options.srcPath + dir;
        return pipeline.pipe(fileHeader(dirPath, options, _options.gulp));
      },
      watch: function(options) {
        return './' + options.srcPath + dir + '/**/*'
      }
    }
  }
};
```
