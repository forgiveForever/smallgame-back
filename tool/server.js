var ws = require("nodejs-websocket");
// 创建websocket服务
const createServer = () => {
    let server = ws.createServer(connection => {
      connection.on('text', function(result) {
        let info = JSON.parse(result)
        let code = info.code
        if (code === CLOSE_CONNECTION) {
          handleCloseConnect(server, info)
          // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
          try {
            connection.close()
          } catch (error) {
            console.log('close异常', error)
          }
        } else if (code === SAVE_USER_INFO) {
          sendChatUsers(server, info)
        } else {
          broadcastInfo(server, info)
        }
      })
      connection.on('connect', function(code) {
        console.log('开启连接', code)
      })
      connection.on('close', function(code) {
        console.log('关闭连接', code)
      })
      connection.on('error', function(code) {
        // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
        try {
          connection.close()
        } catch (error) {
          console.log('close异常', error)
        }
        console.log('异常关闭', code)
      })
    })
    // 所有连接释放时，清空聊天室用户
    server.on('close', () => {
      chatUsers = []
    })
    return server
  }
  
  const server = createServer()
  
  module.exports = server