// consistent use of JQuery
const prevMsgs = $('button#wantMore')
const uri = 'http://localhost:3000'

class Msg {
  // this class helps to handle anything related to msgs.
  constructor (msg, createdAt){
    this.msg = msg
    this.createdAt = createdAt
  }
  static toHTML ({msg, createdAt}) {
    // pass object, builds list item.
      createdAt = (new Date(createdAt))
        .toTimeString()
        .substr(0,5)
    return `<li><span>${msg}</span> &nbsp; <span>${createdAt}</span></li>`
  }

  static put (data) {
    $("#messages").prepend(this.toHTML(data))
  }

  static getMsgs (uri, skip, limit) {
    //returns a promise, errors are catch
    return fetch(`${uri}/messages/skip/${skip}/limit/${limit}`)
      .then(data => data.json())
      .then(items => items.forEach(item => this.put(item)))
      .catch(err => console.log(err))
  }

  static getLastMsgs (uri) { return this.getMsgs(uri, 0,10) }

}


$(function () { // $(document).ready(

  Msg.getLastMsgs(uri).catch(e => console.log(e))

  prevMsgs.click(() => {
    const msgLen = parseInt($("#messages").children().length)
    Msg.getMsgs(uri, msgLen, msgLen+10)
  })

  const socket = io(); //connects to / origin

  $('form').submit(function(e) {
    e.preventDefault(); // prevents page reloading

    const msg = new Msg($('#m').val(), new Date())

    //for the sender, append right away.
    $("#messages").append(Msg.toHTML(msg))
    // and emit, and broadcast
    socket.emit('chat message', msg);
    $('#m').val('');
    return false;
  });

  socket.on('chat message', data => {
    $("#messages").append(Msg.toHTML(data)) 
  })
})
