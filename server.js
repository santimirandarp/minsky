// bidirectional comm. channel between server and client
// ------------------tunnel---------------
//        server <== push msgs ==> client
// ------------------tunnel---------------

const express = require("express")
const app = express()
const http = require('http').createServer(app);
//this is a cool step. 
//app will be the handler of http requests!
const io = require('socket.io')(http);
//some time of events will be handled by socket

require("dotenv").config()
const { uri, user, pass } = process.env

//database
const mongoose = require("mongoose")
const { msgModel } = require("./model")
mongoose.connect(`${uri}`, {
  useNewUrlParser:true, //avoid dpr warn
  useUnifiedTopology:true, //avoid dpr warn
  useCreateIndex:true, //avoid dpr warn
  user:user,
  pass:pass
})

app.use(express.static("static"))
app.get("/", (req, res) => res.sendFile(__dirname+"/index.html"))

//allow the user to load previous messages
app.get("/messages/skip/:skip/limit/:limit", (req, res) => {
  const { skip, limit } = req.params
  console.log(skip, limit)
  msgModel.find({ }, null, { //we set project to null
    sort:{ createdAt:-1 },
    skip:parseInt(skip),
    limit:parseInt(limit)
  }, (err, suc) => {
    if(err) return res.json({ msg:"error" })
    res.json(suc)
  })  
})


io.on('connection', socket => {
  //organized in "events"
  console.log("connection")
  // io is the "server"
  // when socket connects to server, we emit a message
  io.emit( "userconnect", { msg:"new connection" } )
  socket.on('chat message', data => { 
    // save message
    const newMsg = new msgModel(data);
    newMsg.save(function(err, suc){
      if (err) console.log(err)
      console.log(suc, "saved!")
    })
    // emit to all sockets
   io.emit("chat message",  data);
  })
  socket.on('userdisconnect', () => {
    io.emit("userdisconnect", { msg:"User left" }) 
})

})


http.listen(3000);
