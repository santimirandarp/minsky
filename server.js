require("dotenv").config()
const { uri, user, pass } = process.env


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
//io.emit(), socket.emit(), broadcast, socket.on

const cors = require("cors")
// const helmet = require("helmet")

const mongoose = require("mongoose")
const { findMessages, saveMessage } = require("./dbcrud")

mongoose.connect(`${uri}`, {
  useNewUrlParser:true, //avoid dpr warn
  useUnifiedTopology:true, //avoid dpr warn
  useCreateIndex:true, //avoid dpr warn
  user:user,
  pass:pass
})


app.use(cors())
app.use(express.static("static"))
app.get("/", (req, res) => res.sendFile(__dirname+"/index.html"))

//load previous messages
app.get("/messages/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params
  findMessages(skip, limit, (err, doc) => err ? res.status(500)
      .json({ err: err.message }): 
      res.json(doc)
  )})

io.on('connection', socket => {
  socket.emit("socketID", socket.id)

  socket.on('chat message', msg => { 
    saveMessage(msg, (err, suc) => {
      if (err) console.log(err)
      socket.emit("message id", suc._id)
    })
    // all socks but the emiter
    socket.broadcast.emit("chat message",  msg);
  })
  
  socket.on('delete message', 
    deleteMessage(_id, (err, suc) => {
      if (err) return console.log(err)
      socket.emit("deleteMsg", suc)
    socket.broadcast.emit("deleteMessage",  suc);
  }))

  socket.on('update message', 
    updateMessage({_id, msg}, (err, suc) => {
      if (err) return console.log(err)
      socket.emit("updateMessage", suc._id)
    socket.broadcast.emit("updateMessage",  suc);
  })
)


http.listen(3000);
