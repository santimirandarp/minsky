require("dotenv").config()
const { uri, user, pass } = process.env

const express = require("express")
const app = express()
const http = require('http').createServer(app);
//set app as http-requests handler

const io = require('socket.io')(http);
//some events handled by io
//route
const messages = require("./modules/messages")

const cors = require("cors")
// const helmet = require("helmet")
const mongoose = require("mongoose")
const { deleteMessage, saveMessage } = require("./modules/dbcrud")

mongoose.connect(`${uri}`, {
  useNewUrlParser:true, //avoid dpr warn
  useUnifiedTopology:true, //avoid dpr warn
  useCreateIndex:true, //avoid dpr warn
  user:user,
  pass:pass
})


app.use(cors())
app.use(cors())
app.use(express.static("static"))
app.use(express.static("static/css"))

app.get("/", (req, res) => res.sendFile(__dirname+"/index.html"))

//load previous messages
app.use("/messages", messages)

io.on('connection', socket => {
  socket.on('chat message', msg => { 
    saveMessage(msg, (err, suc) => {
      if (err) return res.send("Msg not saved. Try again.")
      socket.emit("message id", suc._id)
      socket.broadcast.emit("chat message",  msg);
      return 0
  })})
  
  socket.on('delete message', _id => {
    console.log("received")
    deleteMessage(_id, (err, suc) => {
      if (err) return res.send("Try again")
      socket.emit("confirm", "this message was deleted")
      socket.broadcast.emit("delete message", {"id":_id});
      return 0
  })})

  socket.on('update message', ({_id, msg}) => {
    updateMessage({_id, msg}, (err, suc) => {
      if (err) return res.send("Try again")
      socket.emit("confirm", "updated")
      socket.broadcast.emit("update message",  {id:_id, updateTo:msg} );
      return 0
  })})

})

http.listen(3000)
