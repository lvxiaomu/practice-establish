"use strict"
const koa = require('koa')
const compress = require('koa-compress')
const logger = require('koa-logger')
const staticCache = require('koa-static-cache')
const _ = require('koa-route')
const router = require('koa-router')()
const json = require('koa-json')
const session = require('koa-generic-session')
const bodyparser = require('koa-bodyparser')
const gzip = require('koa-gzip')
const path = require('path')
const Jade = require('koa-jade')
const request = require('co-request')
const favicon = require('koa-favicon')

//const auth = require('./controllers/authentication')
const common = require('./common/tool')
const cdn = require('./config').cdn

const app = module.exports = koa()

app.use(gzip())


var hash = ''
if (process.env.NODE_ENV == 'production') {
  // 生产用 ↓ ↓ ↓
  hash = require('./public/app/stats.json').hash
  // 生产用 ↑ ↑ ↑
} else {
  // 开发用 ↓ ↓ ↓
  const webpack = require('webpack')
  const webpackDevMiddleware = require('koa-webpack-dev-middleware')
  const webpackHotMiddleware = require('koa-webpack-hot-middleware')
  const webpackConfig = require('./webpack.config.development')
  const compiler = webpack(webpackConfig)
  compiler.plugin("done", function(stats) {
    console.log(`编译完成 hash:${stats.hash}`)
  })
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath, stats: { colors: true } }))
  app.use(webpackHotMiddleware(compiler, { log: console.log }))
  // 开发用 ↑ ↑ ↑
}

app.keys = ['EastSoft', 'Sapphire']

const jade = new Jade({
  viewPath: './views',
  debug: false,
  pretty: false,
  compileDebug: false
})


app.use(jade.middleware)
app.use(bodyparser())
app.use(session({ store: require('koa-redis')({  }), cookie: { maxage: 60 * 60 * 1000 }, rolling: true ,ttl: 24 * 60 * 60 * 1000}))
// Logger
app.use(logger())
// Json

app.use(json())

// mixin ctx
app.use(common.sendfile)
app.use(common.$)

app.use(favicon(path.join(__dirname + '/public/favicon.ico')))


//app.use(_.post('/login', auth.login))
//app.use(_.post('/registration', auth.registration))
//app.use(_.put('/modify', auth.modify))
//app.use(_.put('/modify/:id', auth.reinstall))
//app.use(_.get('/tenant', auth.read))

var files = {}

app.use(staticCache(path.join(__dirname, '/public'), {
  maxAge: 60 * 60 * 24 * 1000
}, files))

for (let path in files) {
  if (/\/app/.test(path))
    files[path].maxAge = 60 * 60 * 24 * 365
}

function *sendMain () {
  this.render('main', {
    cdn,
    hash,
    env: process.env.NODE_ENV
  })
}

router.get('/*', sendMain)

//app.use(_.get('/login', sendMain))
app.use(router.routes())
// Compress
app.use(compress())

if (!module.parent) {
  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`listening on port ${port}`)
}
