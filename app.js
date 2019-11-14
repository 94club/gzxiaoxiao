const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const sha1 = require('sha1')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
app.use(function *(next){
  console.log(this.query)
  let token = 'aixiaoxiaozao'
  let signature = this.query.signature
  let nonce = this.query.nonce
  let timestamp = this.query.timestamp
  let echostr = this.query.echostr
  let str = [token, timestamp, nonce].sort().join('')
  let sha = sha1(str)
  console.log(sha)
  if (sha === signature) {
    this.body = echostr + ''
  } else {
    this.body = 'wrong'
  }
})
app.listen(8003)
console.log('Listen: ' + 8003)

module.exports = app