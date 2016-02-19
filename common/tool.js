"use strict";
const sendFile = require('koa-sendfile')
const request = require('co-request')
const debug = require('debug')
const R = require('ramda')

module.exports = {
  namedPromises: function (obj) {
    var result = {}
    for (let key of obj) {
      result[key] = false;
      obj[key].then(() => {
      })

    }
  },
  makeQueryString: function (obj) {
    return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&')
  },
  $: function * (next) {
    this.$ = function () {

      // 默认添加的头和配置
      if (typeof arguments[0] === 'object') {
        if (typeof arguments[0].headers === 'object') {
          arguments[0].headers.token = this.session.token
        } else {
          arguments[0].headers = { token: this.session.token }
        }

        if (undefined === arguments[0].timeout) {
          arguments[0].timeout = 25000
        }
      }

      return request.apply(request, arguments).then((res) => {
          debug('sapphire:response')(JSON.stringify(res))
      if(!(res.headers === undefined || res.headers.token === undefined)){
        this.session.token = R.path(['headers', 'token'], res)
        debug('sapphire:token')(this.session.token)
      }
      if (2 === Math.floor(res.statusCode / 100)) {
        this.cookies.set('auth', 'pass', {
          expires:new Date(Date.now() + 59 * 60 * 1000),
          path : '/',
          httpOnly: false
        });
      }
      return res;
    })
    }
    yield next
  },
  sendfile: function * (next) {
    this.sendfile = sendFile
    yield next
  }
}

