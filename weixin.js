'use strict'
exports.reply = function *(next) {
  let message = this.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log('扫描二维码=' + message.EventKey + ' ' + message.Ticket)
      }
      this.body = '欢迎艾小小大驾光临\r\n'
    }
    else if (message.Event === 'unsubscribe') {
      console.log('取消订阅')
      this.body = ''
    }else if (message.Event === 'LOCATION') {
      console.log('取消订阅')
      this.body = '上报位置' + message.Latitude + '/' + message.Longitude + '-' + messagePrecision
    }else if (message.Event === 'CLICK') {
      console.log('您点击了菜单')
      this.body = '您点击了菜单' + message.EventKey
    }else if (message.Event === 'SCAN') {
      console.log('扫二维码')
      this.body = '关注二维码' + message.EventKey + ' ' + message.Ticket
    }else if (message.Event === 'VIEW') {
      console.log('您点击了菜单中的链接')
      this.body = '您点击了菜单中的链接' + message.EventKey
    }
  }
  else if (message.MsgType === 'text') {
    let content = message.Content
    let reply = '复杂' + message.Content
    if (content === '1') {
      reply = '口红'
    } else if (content === '2') {
      reply = '香水'
    } else if (content === '3') {
      relpy = '包包'
    } else if (content === '4') {
      reply = [{
        title: '艾小小太可爱了',
        description: '可爱可爱可爱',
        picUrl: 'http://o318.photo.store.qq.com/psbe?/927ce151-a8a2-4032-9f96-9d8fed01d0d9/kqqn187Wc7Afd0BzQz5uZSsbEW3BgQqXLj6Io8Ke*..kfSQO0naKubantTN.sxku/m/dD4BAAAAAAAA/7gIAAA!!null&bo=7gLuAu4CEQAJANI!&rf=photolist&t=5',
        url: 'https://github.com/94club'
      }]
    }
    this.body = reply
  }
  yield next
}