let mongoose = require('mongoose')
let db = mongoose.createConnection('mongodb://127.0.0.1:27017/school',{useNewUrlParser:true})
db.once('open', (callback) => {
  console.log('数据库成功连接');
})
module.exports = db
