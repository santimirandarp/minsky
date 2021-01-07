// consistent use of JQuery
const prevMsgs = $('button#wantMore')
const uri = 'http://localhost:3000'
const deleteMsg = $('.deleteMsg')
const updateMsg = $('.updateMsg')
const dropDown = $('.dropdown')

const dropDownElement = $(`
  <div class="dropdown">
  <p>options</p>
  <div class="operations">
  <p class="delete">Delete</p>
  <p class="update">Update</p>
  </div>
</div>`)

dropDown.click(e => {
 const display = dropDown.style.display 
 if( display=="" || display=="none" ){
     return dropDown.style.display="visible"
  } else { return dropDown.style.display="none" }
})

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
    let li, msg = $('#m').val()
    msg = new Msg(msg, new Date())
    li = msg.toHTML()
    //for the sender, append right away.
    $("#messages").append(li)
    socket.emit('chat message', msg )
    $('#m').val('')
    socket.on("message id", id => { 
      li.attr("data-id", id)
      li.append(dropDownElement)
    })
    return false
  });


  socket.on('chat message', data => Msg.addToDOM(data))
})
