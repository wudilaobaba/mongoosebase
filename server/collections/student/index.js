const db = require('./db')
const mongoose = require('mongoose')
let studentSchema = new mongoose.Schema({
  name:{
    type:String
  },
  age:{
    type:Number,
  },
  hobby:{
    type:Array
  },
  status:{
    type:Number,
    default:2
  }
})

//增： 创建一个实例并save即可新增一条  -----> 增删改查中的增使用实例方法 唯一

//删：使用类的remove方法  class.remove({obj},(err,data)=>{})

//改:
//conditions:查询条件
//update改哪个字段，如{age：30,sex:'女'} 即为将age字段值改为30  sex字段改为'女'
//options:{}
//callback  参数(无)
studentSchema.statics.eidt = function(conditions, update, options, callback) {
  this.model('student').update(conditions, {
    $set: update
  }, options, callback)
}

//普通查询(带排序,_id可以代替时间来排序)  obj为查询条件
//sort中是以数据中的哪个字段进行排序，1为正数 -1为倒数(数据库默认顺序,往下追加)
studentSchema.statics.getNormal = function(obj,callback) {
  this.model('student').find(obj).sort({'_id':-1}).exec((err,data)=>{
    if(err){
      callback('查询失败',null)
    }else{
      let result = JSON.parse(JSON.stringify(data).replace(/_id/g,'id'));
      callback(null,result)
    }
  })
}

/**
*分页查询(带排序,_id可以代替时间来排序)
*sort中是以数据中的哪个字段进行排序，1为正数 -1为倒数(数据库默认顺序)
*@params obj 查询条件,必须包含:pageSize每页条目数量，pageNum:当前页码
*@params callback(err,data) //data为带有页码数据的list数据列表
*/
studentSchema.statics.getByPage = function(obj, callback) {
  let searchObj = JSON.parse(JSON.stringify(obj).replace(/id/g,'_id'));
  let pageSize = Number(searchObj.pageSize) //每页10条数据 前端提供01---------------------------->重要！！！！
  let pageNum = Number(searchObj.pageNum) //当前页码 前端提供02---------------------------->重要！！！！
  if (pageNum < 1) {
    pageNum = 1;
  }
  delete searchObj['pageSize']
  delete searchObj['pageNum']
  this.model('student').find(searchObj).exec((err,data)=>{ //data是根据查询条件obj查到的数据
    if(err){
      callback('查询失败',null)
    }else{
      let totalPage = Math.floor(data.length / pageSize);
      if (data.length % pageSize !== 0) {
        totalPage += 1;
      }
      if (pageNum > totalPage) {
        pageNum = totalPage;
      }
      let query = this.model('student').find(searchObj).sort({'_id':-1}) //此处进行排序
      query.skip((pageNum - 1) * pageSize);
      query.limit(pageSize);
      query.exec(function (err, result) {
        jsonArray = {
          data: result,
          totalCount: data.length,
          pageInfo: { pageNum, pageSize, totalPage }
        }
        callback(null,jsonArray)
      });
    }
  })
}

//以上是常规的增删改查的通用方法
//当然可以走非常规路线，也就是在实例(也就是每一个obj)上进行操作并save()

let student = db.model('student',studentSchema)
module.exports = student
