
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const util = require('./utils')
const fs = require('fs')
const prefix = 'https://api.weixin.qq.com/cgi-bin'
const api = {
  accessToken: prefix + '/token?grant_type=client_credential',
  upload: prefix + '/media/upload'
}
function Wechat(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()
}
  
Wechat.prototype.isValidAccessToken = function (data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }
  let expires_in = data.expires_in
  let now = new Date().getTime()
  if (now < expires_in) {
    return true
  } else {
    return false
  }
}

Wechat.prototype.fetchAccessToken = function (data) {
  let that = this
  console.log(that)
  if (this.access_token && this.expires_in) {
    if (this.isValidAccessToken(this)) {
      return Promise.resolve(this)
    }
  }
  this.getAccessToken().then(function (data) {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      return that.updateAccessToken()
    }

    if (that.isValidAccessToken(data)) {
      return Promise.resolve(data)
    } else {
      return that.updateAccessToken()
    }
  })
  .then(function (data) {
    that.access_token = data.access_token
    that.expires_in = data.expires_in
    that.saveAccessToken(data)
    return Promise.resolve(data)
  })
}

Wechat.prototype.updateAccessToken = function () {
    let appID = this.appID
    let appSecret = this.appSecret
    let url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
    return new Promise(function (resolve, reject) {
      request({url, json: true}).then(function(response) {
        let data = response.body
        let now = new Date().getTime()
        let expires_in = now + (data.expires_in - 20) * 1000
        data.expires_in = expires_in
        resolve(data) 
      })
    })
}

Wechat.prototype.reply = function () {
  let content = this.body
  let message = this.weixin
  let xml = util.tpl(content, message)

  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}

Wechat.prototype.uploadMaterial  =function (type, filepath) {
  let that = this
  let form = {
    media: fs.createReadStream(filepath)
  }
  return new Promise(function (resolve, reject) {
    // 没有使用到fetchaccesstoken  不知道哪里问题
    that.fetchAccessToken().then(function (data) {
      let url = api.upload + '?access_token=' + data.access_token + '&type=' + type
      request({method: 'POST',url,formData: form, json: true}).then(function(response) {
        console.log(response.body)
        let data = response.body
        if (data) {
          resolve(data) 
        } else {
          throw new Error('upload meterial file')
        }
      }).catch(function (err) {
        console.log(err)
      })
    })
  }) 
}

module.exports = Wechat