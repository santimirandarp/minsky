// bidirectional comm. channel between server and client
// ------------------tunnel---------------
//        server <== push msgs ==> client
// ------------------tunnel---------------

const express = require("express")
const app = express()
const http = require('http').createServer(app);
//set app as http-requests handler

const io = require('socket.io')(http);
//some events handled by io
//emitted using socket.emit()

const cors = require("cors")
const mongoose = require("mongoose")

require("dotenv").config()
const { uri, user, pass } = process.env


const { msgModel } = require("./model")
mongoose.connect(`${uri}`, {
  useNewUrlParser:true, //avoid dpr warn
  useUnifiedTopology:true, //avoid dpr warn
  useCreateIndex:true, //avoid dpr warn
  user:user,
  pass:pass
})
//deprecation warnings come diff mongoose v native driver

app.use(cors())
app.use(express.static("static"))
app.get("/", (req, res) => res.sendFile(__dirname+"/index.html"))

//allow the user to load previous messages
app.get("/messages/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params
  msgModel
    .find({ })
    .sort({ createdAt:-1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .exec((err, doc) => {
    return err ? 
        res.status(500).json({ err:"Server Error" }): 
        res.json(doc)
  })  
})

io.on('connection', socket => {
  socket.emit("socketID", socket.id)
  
  socket.on('chat message', ({id, msg}) => { 

    (new msgModel(msg)).save(function(err, suc){
      if (err) console.log(err)
      let msgId = suc._id 
      console.log("socketID", id, "msgId", msgId)
      socket.emit("message id", msgId)
    })
    
    // emit to all sockets but the emitter
   socket.broadcast.emit("chat message",  msg);
  })

})


http.listen(3000);
