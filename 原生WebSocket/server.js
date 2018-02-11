const net=require('net');
const crypto=require('crypto');
//1.创建tcpserver
let server=net.createServer(socket=>{
  console.log('有人连接我了');
  //console.log(socket);
  //3.接收浏览器发过来的信息
  //第一次
  socket.once('data',data=>{
    //data是一个buffer
    //console.log(data);
    //第一步 将数据转成json
    let str=data.toString();
    let aHeader=str.split('\r\n');

    aHeader.shift();
    aHeader.pop();
    aHeader.pop();



    let headers={};
    aHeader.forEach(str=>{
      let[name, value]=str.split(': ');
      headers[name]=value;
    });

    //第二部 效验
    if(headers['Connection']!='Upgrade'||
    headers['Upgrade']!='websocket'){
      console.log('找到了一个ws以外的协议，扔了');
      socket.end();
    }else{
      //第三步 处理websocket专有头
      if(headers['Sec-WebSocket-Version']!=13){
          console.log('出现了以外的ws版本');
          socket.end();
      }else{
        //第四部 处理key
        //c->s  WMGGEbvxTN/wwPIOBmSIAg==
        //s->c   +上一个特殊的guid base64(sha1("WMGGEbvxTN/wwPIOBmSIAg=="+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
        let hash=crypto.createHash('sha1');
        hash.update(headers['Sec-WebSocket-Key']+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
        let base64Key=hash.digest('base64');

        //base64=>client
        socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade:websocket\r\nConnection:Upgrade\r\nSec-WebSocket-Accept: ${base64Key}\r\n\r\n`);
        console.log('握手完成');
       }
       //后续
       socket.on('data',(data)=>{
         console.log(data);
         //帧结构
       });
    }


  });
  socket.on('end',()=>{
    console.log('连接已断开');
  });
});
server.listen(8080);
