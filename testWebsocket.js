
// type 0 代表第一次传送用户标识，
    var ws = new WebSocket('ws://127.0.0.1:8001');
    var session = window.sessionStorage;
    ws.onopen = function(e){
                console.log("连接服务器成功");
                var timestamp = (new Date()).valueOf();
                timestamp = timestamp+''
                let info={
                    uid:timestamp,
                    type:0
                }
                session.setItem('uid',timestamp)
                ws.send(JSON.stringify(info));

            }
            ws.onclose = function(e){
                console.log("服务器关闭");
            }
            ws.onerror = function(){
                console.log("连接出错");
            }

            ws.onmessage = function(e){
                mess.innerHTML = "连接成功"
                document.querySelector(".kuang").onclick = function(e){
                    var time = new Date();
                    ws.send(time + "  game1点击了“" + e.target.innerHTML+"”");
                }
            }

        function getWebsocket(){
            return ws;
        }