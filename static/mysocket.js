// consistent use of JQuery
const prevMsgs = $('button#wantMore')
const uri = 'http://localhost:3000'


$(function () { // $(document).ready(
  const socket = io(); //connects to / origin

  Msg.getLastMsgs(uri).catch(e => console.log(e))

  prevMsgs.click(() => {
    const msgLen = parseInt($("#messages").children().length)
    Msg.getMsgs(uri, msgLen, msgLen+10)
  })

  $('form').submit(function(e) {
    /* 
       on input submit append msg to DOM and 
       send to server. On server OK add _id
       and enable + CRUD operations
    */
    e.preventDefault(); 
    let dropdwn, operations, options, del, li, msg = $('#m').val()
    
    //Append Msg on Submit
    msg = new Msg(msg, new Date())
    li = msg.toHTML(own=true)
    //for the sender, append right away.
    $("#messages").append(li)
    socket.emit('chat message', msg )
    $('#m').val('')

    //LI interaction
    dropdown = li.children('.dropdown')
    options = dropdown.children('.options')
    operations = dropdown.children('.operations')
    del = operations.children('.delete')

    del.click( function() {
      const _id =  $(this).closest("li").attr("data-id")
      socket.emit("delete message", _id)
      console.log("emited")
    })

    options.click(() => operations.toggle() )
    operations.focusout(() => operations.hide() )

    socket.on("message id", id => li.attr("data-id", id))
    });
    socket.on('chat message', data => Msg.addToDOM(data))
  })
