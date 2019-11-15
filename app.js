const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const wechat = require('./wechat/g')
const path = require('path')
const wechat_file = path.join(__dirname + '/config/wechat_file.txt')
const util = require('./libs/util')
const config = {
  wechat: {
     appID: 'wxc3cd965c137ba0c9',
     appSecret: 'e7e45b24d00b0efbf039385f2fd1de1e',
    //appID: 'wxea4c4450bef2ac6a',
    //appSecret: '17e486f43bef9b7c79f264312b9b6df1',
    token: 'aixiaoxiaozao',
    getAccessToken: function () {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function (data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    }
  }
}


// const index = require('./routes/index')
// const users = require('./routes/users')

// // error handler
// onerror(app)

// // middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
// app.use(json())
// app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'ejs'
// }))

// // logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// // routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// // error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// });
app.use(wechat(config.wechat))
app.listen(8003)
console.log('Listen: ' + 8003)

module.exports = app
