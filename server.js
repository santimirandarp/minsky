//bidirectional comm. channel between server and client
// this is: server <== push msgs ==> client
const express = require("express")
const app = express()
const http = require('http').createServer(app);
//this is a cool step. 
//app will be the handler of http requests!
const io = require('socket.io')(http);
//some time of events will be handled by socket


app.get("/", (req, res) => res.send("<h1>hello world</h1>"))
   
io.on('connection', client => {
  console.log("connection")
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

http.listen(3000);
