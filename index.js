
var ws = require("nodejs-websocket");
console.log("开始建立连接...")

let userlist =[]
let roomlist =[]
var server = ws.createServer(function(conn){
    conn.on("text", function (info) {
        // var timestamp = (new Date()).valueOf();
        // conn.eid = timestamp
        var content = JSON.parse(info)
        
        if( content.sendtype == 0){
        console.log("连接："+content.userInfo.uid)
        var userInfo = content.userInfo;
        //以用户id 设置连接标识
        conn.uid = userInfo.uid;

        // console.log(content)
        // console.log("***********************************************")
        addUser(userInfo);
        // console.log(userlist)
        // console.log("***********************************************")
        let room = addDealRoom(userInfo);
        // console.log("***********************************************")
        // console.log(room)
        let info={
            userInfo:null,
            sendtype:0,
            returntype:0,
            returnisclear:true,
            returnroom:room,
            draw_info:null,
            draw_uid:room.draw_uid,
        }
        conn.sendText(JSON.stringify(info));

        //o 代表客户端刷新房间 的用户
        info.returntype = 0; 
        info.returnisclear =false;
       // console.log(room)
        broadcastroom(server,info,room)
        }

        if(content.sendtype == 1){
            var userInfo = content.userInfo;
            let room = findroom(userInfo);
            broadcastroom(server,content,room);
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

function addDealRoom(userInfo){
    var flag = false;
    var room =null;
    roomlist.forEach((val)=>{
        console.log("roomid:"+val.roomid+" userInfo:"+userInfo.roomid)
        if(val.roomid == userInfo.roomid){
            val.room_userlist.push(userInfo)
            room =val;
        }
        else{
         flag = true;
        }
    })

    if(flag||roomlist.length==0){
        var room_userlist =[];
        room_userlist.push(userInfo);
        console.log(room_userlist)
        var tem_room = {
            roomid:userInfo.roomid,
            room_num:3,
            room_status:false,
            room_userlist:room_userlist,
            draw_uid:userInfo.uid
        }
        roomlist.push(tem_room)
        room =tem_room;
    }
    
    return room;
}


function findroom(userInfo){
    var room = [];
    roomlist.forEach((val)=>{ if(val.roomid==userInfo.roomid) room =val ;})
    return room;
}
function broadcastroom(server, info,room){
   
    var room_userlist = room.room_userlist;
   // room_userlist = room_userlist.filter((val)=>{ val.uid != userInfo.uid}) 
    server.connections.forEach((conn)=>{
        room_userlist.forEach((val)=>{
            if(conn.uid != val.uid ){
                
                conn.sendText(JSON.stringify(info));
             }
        })
    })
}