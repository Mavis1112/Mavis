const http=require('http');
const mysql=require('mysql');
const fs=require('fs');
const io=require('socket.io');
const regs=require('./lib/regs');

//数据库
let db=mysql.createPool({host:'localhost',user:'root',password:'123456',database:'20171128'});
//1.http服务
let httpServer=http.createServer((req,res)=>{
  fs.readFile(`www${req.url}`,(err,data)=>{
    if(err){
      res.writeHeader(404);
      res.write('Not Found');
      res.end();
    }else{
      res.write(data);
    }
    res.end();
  });
});

httpServer.listen(8080);

//2.WebSocket服务器
let aSock=[];
let wsServer=io.listen(httpServer);
wsServer.on('connection',sock=>{
  aSock.push(sock);
  let cur_username='';
  let cur_userID=0;
  //注册
  sock.on('reg',(user,pass)=>{
    //1.校验数据
    if(!regs.username.test(user)){
      sock.emit('reg_ret',1,'用户名不符合规范');
    }else if(!regs.password.test(pass)){
      sock.emit('reg_ret',1,'密码不符合规范');
    }else{
      //2用户名是否存在
      db.query(`SELECT ID FROM user_table WHERE username='${user}'`,(err,data)=>{
        if(err){
          sock.emit('reg_ret',1,'数据库错误');
        }else if(data.length>0){
          sock.emit('reg_ret',1,'用户名已存在');
        }else{
          //3插入
          db.query(`INSERT INTO user_table(username,password,online) VALUES('${user}','${pass}',0)`,err=>{
            if(err){
              sock.emit('reg_ret',1,'数据库插入错误');
            }else{
              sock.emit('reg_ret', 0, '注册成功');
            }
          });
        }
      });

    }

  });
  //登录
  sock.on('login',(user,pass)=>{
    //1.校验数据
    if(!regs.username.test(user)){
      sock.emit('login_ret',1,'用户名不符合规范');
    }else if(!regs.password.test(pass)){
      sock.emit('login_ret',1,'密码不符合规范');
    }else{
      //2.用户信息
      db.query(`SELECT ID,password FROM user_table WHERE username='${user}'`,(err,data)=>{
        if(err){
          sock.emit('login_ret',1,'数据库有误');
        }else if(data.length==0){
          sock.emit('login_ret',1,'用户不存在');
        }else if(data[0].password!=pass){
          sock.emit('login_ret',1,'用户名或密码有误');
        }else{
              //3.更改状态
          db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`,err=>{
            if(err){
                sock.emit('login_ret',1,'数据库有误');
            }else{
                sock.emit('login_ret',0,'登录成功');
                cur_userID=data[0].ID;
                cur_username=user;
            }
          });
        }
      });
    }

  });
  //发言
  sock.on('msg',txt=>{
    if(!txt){
      sock.emit('msg_ret',1,'消息文本不能为空');
    }else{
      //广播给所有人
      aSock.forEach(item=>{
        if(item==sock)return;
        item.emit('msg',cur_username,txt);
      });
      sock.emit('msg_ret',0,'发送成功');
    }
  });
  //离线
  sock.on('disconnect',function (){
      db.query(`UPDATE user_table SET online=0 WHERE ID=${cur_userID}`,err=>{
        if(err){
          console.log('数据库有误',err);
        }
        cur_userID=0;
        cur_username='';
        aSock=aSock.filter(item=>item!=sock);
      });
  });
});
