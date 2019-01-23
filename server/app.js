const express = require('express');
const router = require('./router');
let app = express();
app.use((req, res, next) => {
  if (req.headers.origin == 'http://30.20.93.18:3000' || req.headers.origin == 'http://127.0.0.1:3000' || req.headers.origin == 'http://localhost:3000') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, X-Test-Cors');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  next()
})

//此demo全部都是get请求，若要求为post请求，要在router中追加一个对应的post提交方法

//增
//前端传参  即将增加的条目的字段 { key1: value1, key2: value2 }
app.get('/addData',router.addData);

//删
//单个删除:前端传参 {id:'123456789'}
//批量删除:前端传参 {id:'["13245789","445855225"]'}  注意 id的value为字符串
app.get('/delData',router.delData);

//改(单个修改)
//前端传参{id:'xxx',+该条目的其他字段}
app.get('/editData',router.editData);

//普通查询
//前端传参 {}或{该字段中的一个或多个key:value}
app.get('/getData',router.getData);

//分页查询
//前端传参 {pageSize:10,pageNum:1,+其他字段key:value}
// ps：pageSize每页条目数量，pageNum:当前页码
app.get('/getByPage',router.getByPage);

app.listen(9527);
