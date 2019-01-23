const student = require('../collections/student')


//以下两个添加的回调不同：
//001.
// new student({
//   name:"Mike",
//   age:12,
//   hobby:[55,66,33]
// }).save().then(()=>{console.log('添加了')})
//002.
// new student({
//   name:req.query.name,
//   age:req.query.age
// }).save((err,data)=>{
//   console.log(data);
//   res.send({
//     msg:'添加成功',
//     code:0
//   })
// })

//增(单个增加)
exports.addData = (req,res)=>{
  new student({
    name:req.query.name,
    age:req.query.age
  }).save((err,data)=>{
    console.log(data);
    if(err){
      res.send({
        msg:'添加失败',
        code:-1
      })
    }else{
      res.send({
        msg:'添加成功',
        code:0
      })
    }
  })
}

//删(单个删除和批量删除)
exports.delData = (req,res)=>{
  if(req.query.id[0]!=='['){
    student.remove({'_id':req.query.id},(err,data)=>{
      if(err){
        res.send({
          msg:'删除失败',
          code:-1
        })
      }else{
        if(data.n===0){
          res.send({
            msg:'删除失败',
            code:-1
          })
        }else{
          res.send({
            msg:'删除成功',
            data,
            code:0
          })
        }
      }
    })
  }else{
    let flagArr = [];
    let errId = [];
    JSON.parse(req.query.id).map((item,index)=>{
      student.remove({'_id':item},(err,data)=>{ //此处是异步代码！！！！！！！！！！！！！
        flagArr.push({id:item,type:data.n});
      })
    })
    setTimeout(()=>{
      flagArr.map((item,index)=>{
        if(item.type===0){
          errId.push(item.id)
        }
      })
      console.log(errId);
      res.send({
        msg:errId.length===0?'删除成功':'删除异常',
        errId,
        code:errId.length===0?0:-1,
      })
    },500)
  }
}

//改(单个修改)
exports.editData = (req,res)=>{
  let id = req.query.id;
  delete req.query['id']
  if(!id){
    res.send({
      msg:'修改失败',
      code:-1
    });
  }else{
    student.eidt({'_id':id}, req.query, {}, ()=>{//callback没有参数
      res.send({
        msg:'修改成功',
        code:0
      });
    })
  }
}

//普通查询 req.query为查询条件
exports.getData = (req,res)=>{
  console.log(req.query);
  let searchObj = JSON.parse(JSON.stringify(req.query).replace(/id/g,'_id'));
  student.getNormal(searchObj,(err,data)=>{
    res.send(data);
  })
}

//分页查询
exports.getByPage = (req,res)=>{
  student.getByPage(req.query, (err,data)=>{
    if(err){
      res.send({
        msg:err,
        code:-1
      })
    }else{
      res.send({
        data,
        code:0
      })
    }
  })
}
