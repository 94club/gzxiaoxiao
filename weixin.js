'use strict'
exports.reply = function *(next) {
  let message = this.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log('扫描二维码=' + message.EventKey + ' ' + message.ticket)
      }
      this.body = '94club欢迎你\r\n' + ' 消息ID=' + message.MsgId
    }
    else if (message.Event === 'unsubscribe') {
      console.log('取消订阅')
      this.body = ''
    }
  }
  yield next
}