var watch = require('gulp-watch'),
    util = require('./util');


module.exports = function(options) {
  return {
    build: function() {
      var pluginContext = 'public',
          pipeline = util.src(['public/**/*'], options);
      if (options.watch) {
        pipeline = pipeline.pipe(watch());
      }
      pipeline = util.pipeIf('complete', pluginContext, pipeline, options);
      pipeline = pipeline.pipe(options.gulp.dest(options.buildPath));
    }
  }
};
