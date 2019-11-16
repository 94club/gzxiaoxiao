const path = require('path')
const wechat_file = path.join(__dirname + '/config/wechat_file.txt')
const util = require('./libs/util')
const config = {
  wechat: {
     appID: 'wxc3cd965c137ba0c9',
     appSecret: 'e7e45b24d00b0efbf039385f2fd1de1e',
    // appID: 'wxea4c4450bef2ac6a',
    // appSecret: '17e486f43bef9b7c79f264312b9b6df1',
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
module.exports = config