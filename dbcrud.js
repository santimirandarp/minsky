const { msgModel } = require("./model")

const find = (skip, limit, done) => {
  msgModel
    .find({ })
    .sort({ createdAt:-1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .exec(done)  
}

const save = (msg, done) => (new msgModel(msg)).save(done)

const update = (id, msg, done) => msgModel.update( {_id:id}, {
  msg:msg, 
  createdAt: Date()
}, done)

const del = (id, done) => msgModel(_id:id).deleteOne(done)

export.findMessages = find
export.saveMessage = save
export.updateMessage = update
export.deleteMessage = del
