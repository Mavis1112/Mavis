# Node.js在MySql中存储数据、创建连接池及MySQL基础
1. 安装mysql客户端安装包
``` cmd
npm i mysql -D
```
引用mysql模块
```javascript
var mysql = require('mysql');
```
2. 建立连接
- **mysql.createConnection(options)**</br>
 options为参数，是一个对象或者url字符串，用于指定该连接所用的各种选项。当为对象时一些属性有：host，port，user，password，database，multipleStatements，以上是常用的，还有一些不常用的，socketPath，charset，timezone，stringifyObjects，insecureAuth，typeCast，queryFormat，supportBigNumbers，bigNumbersStrings，debug等

 - **mysql.createPool** 性能优化</br>
 在服务器应用程序中通常需要为多个数据库连接创建并维护一个连接池，当连接不再需要时，这些连接可以缓存在连接池中，当接收到下一个客户端请求时，从连接池中取出连接并重新利用，而不需要再重新建立连接。
3. 数据库分类
- 关系型数据库——MySql、Oracle</br>
优点：强大(9)</br>
缺点：性能低(7.5)</br>
- 文件型数据库——SQLite</br>
优点：简单</br>
缺点：支撑不了庞大应用，没法存储特别多的数据
- 文档型数据库——MongoDB</br>
优点：直接存储对象本身</br>
缺点：不够严谨，性能偏低(6.5)</br>
- 空间型数据库——坐标、位置
4. 简单的SQL语句
- 增</br>
```sql
INSERT INTO 表(字段列表) VALUES(值);
```
- 删
```sql
DELETE FROM 表 WHERE 条件;
```
- 改
```sql
UPDATE 表 SET 字段=新值,字段=新值,...WHERE 条件;
```
- 查
```sql
SELECT 字段列表 FROM 表 WHERE 条件;
```
