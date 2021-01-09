// consistent use of JQuery
const prevMsgs = $('button#wantMore')
const uri = 'http://localhost:3000'
const deleteMsg = $('.deleteMsg')
const updateMsg = $('.updateMsg')


$(function () { // $(document).ready(
  const socket = io(); //connects to / origin

  Msg.getLastMsgs(uri).catch(e => console.log(e))

  prevMsgs.click(() => {
    const msgLen = parseInt($("#messages").children().length)
    Msg.getMsgs(uri, msgLen, msgLen+10)
  })

  deleteMsg.click( e => {
     e.preventDefault()
     console.log(e)
  })

  updateMsg.click( e => {
     e.preventDefault()
     console.log(e)
  })

  $('form').submit(function(e) {
    /* 
       on input submit append msg to DOM and 
       send to server. On server OK add _id
       and enable + CRUD operations
    */
    e.preventDefault(); 
    let dropdown, li, msg = $('#m').val()
    msg = new Msg(msg, new Date())
    li = msg.toHTML(own=true)
    //for the sender, append right away.
    li.attr("data-id", "")
    $("#messages").append(li)
    socket.emit('chat message', msg )
    $('#m').val('')
    dropdown = li.children('.dropdown')
    dropdown.on("click", function (){
      console.log(this)
      $(this).children('.operations').toggle()
      })
    dropdown.on("focusout", function (){
      console.log(this)
      $(this).children('.operations').toggle()
      })
    socket.on("message id", id => li.attr("data-id", id))
  });
  socket.on('chat message', data => Msg.addToDOM(data))
})
