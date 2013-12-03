exports.config =
# See https://github.com/indolering/brunch/tree/master/docs for documentation.
  files:
    javascripts:
      joinTo:
        'scripts/speech.js': /^app\/scripts/
#      TODO: split speech.js from config.js
#        'scripts/config.js': /^app\/scripts/ fuck regex!
#      TODO: cut jQuery to minimal size
#        'scripts/vendor.js': /^app\/vendor/
#        'test/scripts/test.js': /^test(\/|\\)(?!vendor)/
#        'test/scripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
      order:
        before: []
    stylesheets:
      joinTo:
        'styles/main.css': /^(app|vendor)/
#        'test/styles/test.css': /^test/
      order:
        before: []
        after: []
    templates:
      joinTo: 'scripts/speech.js'
  plugins:
    autoprefixer:
      browsers: ["last 1 version", "> 10%"]
    imageoptimizer:
      smushit: false # if false it use jpegtran and optipng, if set to true it will use smushit
      path: 'images' # your image path within your public folder
