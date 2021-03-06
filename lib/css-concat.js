//
//  Merge all css documents found into a single root level document called style.
//
var through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    gwmUtil = require('gwm-util')
    File = gutil.File;

module.exports = function(options) {
  options = (options || {}).css || {};
      fileName = options.fileName || 'style.css',
      priority = options.priority;

  var buffer = [],
      firstFile;

  return through.obj(function(file, enc, callback) {
      var extIndex = file.path.indexOf('.css');

      if (extIndex === -1) {
        // not a stylesheet
        this.push(file);
        return callback();
      }

      if (!firstFile) firstFile = file;
      buffer.push(file);
      callback();
    },

    function(callback) {
      if (firstFile) {
        var orderedFileList = buffer.sort(function(file) {
            return gwmUtil.util.priorityIndex(file.path, priority);
          }).map(function(file) {
            return file.contents;
          });

        var spacedList = [];
        for (var i in orderedFileList) {
          spacedList.push(orderedFileList[i]);
          spacedList.push(new Buffer('\n'));
        }

        var templatesFile = new File({
          cwd: firstFile.cwd,
          base: firstFile.base,
          path: path.join(firstFile.base, fileName),
          contents: Buffer.concat(spacedList)
        });
        this.push(templatesFile);
      }
      callback();
    }
  );
}
