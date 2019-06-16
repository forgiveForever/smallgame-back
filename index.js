
var ws = require("nodejs-websocket");
console.log("开始建立连接...")

let userlist =[]
var server = ws.createServer(function(conn){
    conn.on("text", function (info) {
        // var timestamp = (new Date()).valueOf();
        // conn.eid = timestamp
        var content = JSON.parse(info)
       
        if( content.type == 0){
            console.log("连接："+content.uid)
             conn.uid = content.uid
             let user= {
                 uid:content,
                 name:"默认",
                 status:false
             };
             addUser(user)
            }
        if(content.type == 1){
            broadcast(server,content.drawobj)
        }
       
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001)
console.log("WebSocket建立完毕")


function addUser(user){
    userlist.push(user);
};

function broadcast(server, info){
    server.connections.forEach((conn)=>{
         conn.sendText(JSON.stringify(info));
    })
}