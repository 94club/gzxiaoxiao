
const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const api = {
  accessToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'
}
function Wechat(opts) {
    let that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
  
    this.getAccessToken().then(function (data) {
      try {
        data = JSON.stringify(data)
      } catch (error) {
        return that.updateAccessToken()
      }
  
      if (that.isValidAccessToken(data)) {
        Promise.resolve(data)
      } else {
        return that.updateAccessToken()
      }
    })
    .then(function (data) {
      that.accessToken = data.accessToken
      that.expires_in = data.expires_in
      that.saveAccessToken(data)
    })
  }
  
Wechat.prototype.isValidAccessToken = function (data) {
if (!data || !data.accessToken || !data.expires_in) {
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

  module.exports = Wechat