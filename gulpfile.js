var gulp = require("gulp")
var karma = require('gulp-karma')
var mocha = require('gulp-mocha')
var path = require('path')
var eslint = require('gulp-eslint')

var srcPath = {
  css: ['./app/stylesheets/**/*.css'],
  sass: ['./app/sass/**/*.scss'],
  watch: ['app/javascripts/*.*'],
  test: {
    backend: ['test/backend/*.js'],
    frontend: ['test/frontend/*.js']
  }
}

gulp.task('eslint', function(){
  return gulp.src(srcPath.watch)
    .pipe(eslint())
    .pipe(eslint.results(function (results) {
      // Called once for all ESLint results.
      console.log('Total Results: ' + results.length);
      console.log('Total Warnings: ' + results.warningCount);
      console.log('Total Errors: ' + results.errorCount);
    }));
})

/**
 * Run test once and exit
 */
gulp.task('test:backend', function () {
  return gulp.src(srcPath.test.backend)
    .pipe(mocha())
    .once('error', function () {
      process.exit(1)
    })
    .once('end', function () {
      process.exit()
    })
})

gulp.task('test:frontend', function () {
  return gulp.src(srcPath.test.frontend)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err
    })
})

gulp.task('test', function () {
  gulp.start(['test:backend', 'test:frontend'])
})

gulp.task('default', function () {
  gulp.start(['eslint'])
  gulp.watch(srcPath.watch, ['eslint'])
})

gulp.task('oss', function(){
  const hash = require('./public/app/stats.json').hash
  return gulp.src([`./public/app/${hash}/**/*`]).pipe(oss(options))
})

const PLUGIN_NAME = 'gulp-oss';

var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var colors = require('gulp-util').colors;
var log = require('gulp-util').log;
var ALY = require('aliyun-sdk');
var Moment = require('moment');
var Q = require('q');
const zlib = require('zlib')

const ContentType = {
  txt: 'text/plan',
  md: 'text/plan',
  js: 'application/javascript',
  json: 'application/json',
  css: 'text/css',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  woff: 'application/x-font-woff',
  woff2: 'application/x-font-woff',
  webp: 'image/webp'
}

function oss (option) {
  if (!option) {
    throw new PluginError(PLUGIN_NAME, 'Missing option!');
  }
  if(!option.bucket){
    throw new PluginError(PLUGIN_NAME, 'Missing option.bucket!');
  }

  //var ossClient = new ALY.OSS({
  //    accessKeyId: option.accessKeyId,
  //    secretAccessKey: option.secretAccessKey,
  //    endpoint: option.endpoint,
  //    apiVersion: option.apiVersion
  //});

  var version = Moment().format('YYMMDDHHmm');

  return through2.obj(function (file, enc, cb) {
    if(file.isDirectory()) return cb();
    if(file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }
    if(file.contents.length >= option.maxSize){
      log('WRN:', colors.red(file.path + "\t" + file.contents.length));
      console.log(file)
      return cb();
    }
    var getFileKey = function(){
      return option.prefix
        + ((!option.prefix || option.prefix[option.prefix.length - 1]) === '/' ? '' : '/')
        + (option.versioning ? version + '/' : '')
        + path.relative(file.base, file.path);
    };
    var uploadFile = function(fileKey){
      var ossClient = new ALY.OSS({
        accessKeyId: option.accessKeyId,
        secretAccessKey: option.secretAccessKey,
        endpoint: option.endpoint,
        apiVersion: option.apiVersion
      });
      ossClient.putObject({
          Bucket: option.bucket,
          Key: fileKey,
          Body: zlib.gzipSync(file.contents),
          AccessControlAllowOrigin: '*',
          CacheControl: 'public, max-age=31536000',
          ContentDisposition: '',
          ContentEncoding: 'gzip',
          ContentType: ContentType[path.extname(file.path).slice(1)] || 'text/plan',
          ServerSideEncryption: 'AES256'
          //Expires: Moment().unix()
        }, function (err, data) {
          if (err) {
            console.log('error:', err);
            log('ERR:', colors.red(fileKey + "\t" + err.code));
          }else{
            log('OK:', colors.green(fileKey));
          }
        }
      );
    };
    Q.fcall(getFileKey).then(uploadFile).catch(console.log);
    this.push(file);
    return cb();
  });
}
