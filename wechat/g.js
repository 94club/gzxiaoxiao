const sha1 = require('sha1')
const Promise = require('bluebird')
// 通过raw-body模块可以把this上的request对象（也是http的request）拼装它的数据拿到一个buffer的xml
const getRawBody = require('raw-body')
const Wechat = require('./wechat')
const util = require('./utils')
module.exports = function (opts) {
  // const wechat = new Wechat(opts)
  return function *(next) {
    const token = opts.token
    const { signature, timestamp, nonce, echostr } = this.query
    let str = [token, timestamp, nonce].sort().join('')
    let sha = sha1(str)
    console.log(sha)
    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + ''
      } else {
        this.body = 'wrong'
      }
    } else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong'
        return false
      }

      const data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.encoding
      })
      // console.log(data.toString())
      let content = yield util.parseXMLAsync(data)
      console.log(content)
      let message = util.formatMessage(content.xml)
      console.log(message)
    }
  }
}
