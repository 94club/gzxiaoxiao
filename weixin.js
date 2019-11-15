'use strict'
exports.reply = function *(next) {
  let message = this.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log('扫描二维码=' + message.EventKey + ' ' + message.ticket)
      }
      this.body = '欢迎艾小小大驾光临\r\n'
    }
    else if (message.Event === 'unsubscribe') {
      console.log('取消订阅')
      this.body = ''
    }
  }
  yield next
}