'use strict'

const Wechat = require('./wechat/wechat')
const config = require('./config')

const wechatapi = new Wechat(config.wechat)

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
      console.log('上报位置')
      this.body = '上报位置' + message.Latitude + '/' + message.Longitude + '-' + message.Precision
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
      reply = '包包'
    } else if (content === '4') {
      reply = [{
        title: '艾小小太可爱了',
        description: '可爱可爱可爱',
        picUrl: 'https://xiaoai.jiaxiu.club/img/16e6ea393dd.png',
        url: 'https://xiaoai.jiaxiu.club/img/16e6ea393dd.png'
      }]
    } else if (content === '5') {
      let data = yield wechatapi.uploadMaterial('image', __dirname + '/psbe.jpg')
      reply = {
        msgType: 'image',
        mediaId: data.media_id
      }
    } else if (content === '6') {
      let data = yield wechatapi.uploadMaterial('video', __dirname + '/3.mp4')
      console.log()
      reply = {
        msgType: 'video',
        mediaId: data.media_id,
        title: '小艾',
        description: '视屏'
      }
    } else if (content === '7') {
      let data = yield wechatapi.uploadMaterial('image', __dirname + '/psbe.jpg')
      console.log()
      reply = {
        msgType: 'music',
        title: '回复音乐',
        description: '音乐',
        musicUrl: 'https://xiaoai.jiaxiu.club/img/3.mp3',
        ThumbMediaId: data.media_id
      }
    }
    this.body = reply
  }
  yield next
}