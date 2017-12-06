const http=require('http');
const fs=require('fs');
const url=require('url');
const io=require('socket.io');
const mysql=require('mysql');
const regs=require('./lib/regs');

//连接数据库
let db=mysql.createPool({host: 'localhost',user: 'root',password: '123456',database: '20171128'});

//创建httpserver
let httpServer = http.createServer((req,res)=>{
  //reg.url = /reg?user=mm&pass=123   pathname =/reg query 为后面数据的json
  let {pathname,query}=url.parse(req.url,true);

  if(pathname=='/reg'){
    let {user,pass}=query;
    //校验数据 6-32数字字母下划线
    if(!regs.username.test(user)){
      res.write(JSON.stringify({code: 1,msg: '用户名不符合规范'}));
      res.end();
    }else if(!regs.password.test(pass)){
      res.write(JSON.stringify({code: 1,msg: '密码不符合规范'}));
      res.end();
    }else {  //检查用户名是否重复
      db.query(`SELECT ID FROM user_table WHERE username='${user}'`,(err,data)=>{
        if(err){
          res.write(JSON.stringify({code: 1,msg: '数据库检查用户名有误'}));
          res.end();
        }else if(data.length>0){
          res.write(JSON.stringify({code: 1,msg: '用户名已存在'}));
          res.end();
        }else{
          //插入
        db.query(`INSERT INTO user_table (username,password,online) VALUES('${user}','${pass}',0)`, err=>{
          if(err){
            res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
            res.end();
            }else{
              res.write(JSON.stringify({code: 0,msg:'注册成功'}));
              res.end();
            }
          });
        }
      });


    }
  }else if(pathname=='/login'){
    //登录接口
    let {user,pass}=query;

    //校验数据
    if(!regs.username.test(user)){
      res.write(JSON.stringify({code: 1, msg: '用户名不符合规范'}));
      res.end();
    }else if(!regs.password.test(pass)){
      res.write(JSON.stringify({code: 1,msg: '密码不符合规范'}));
      res.end();
    }else{
      //取数据
      db.query(`SELECT ID,password FROM user_table WHERE username='${user}'`,(err,data)=>{
        if(err){
          res.write(JSON.stringify({code: 1,msg: '数据库有误'}));
          res.end();
        }else if(data.length==0){
          res.write(JSON.stringify({code: 1,msg: '此用户不存在'}));
          res.end();
        }else if(data[0].password!=pass){
          res.write(JSON.stringify({code: 1,msg: '用户名或密码有误'}));
          res.end();
        }else{
          //设置状态
          db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`,(err,data)=>{
            if(err){
              res.write(JSON.stringify({code: 1,msg: '数据库有误'}));
              res.end();
            }else{
              res.write(JSON.stringify({code: 0, msg: '登陆成功'}));
              res.end();
            }
          });
        }
      });
    }
  }else{
    fs.readFile(`www${pathname}`,(err,data)=>{
      if(err){
        res.writeHeader(404);
        res.write('Not Found');
      }else{
        res.write(data);
      }
      res.end();
    });

  }
});

httpServer.listen(8080);
