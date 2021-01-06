// consistent use of JQuery
const prevMsgs = $('button#wantMore')
const uri = 'http://localhost:3000'

class Msg {
  constructor (msg, createdAt){
    this.msg = msg
    this.createdAt = createdAt
  }
  toHTML (){
    let createdAt = (new Date(this.createdAt))
      .toTimeString()//improves the format
      .substr(0,5) //first 5 symbols (0,1,2,3,4)
    let msg = $("<span></span>").text(this.msg)//ensure it's text
    return $(`<li data-id=${this._id}>&nbsp;<span>${createdAt}</span></li>`).prepend(msg)
  }
  static toHTML ({ msg, createdAt, _id }) {
    // pass object, builds list item.
    createdAt = (new Date(createdAt))
      .toTimeString()
      .substr(0,5)
    //creates span, includes plain text on it
    msg = $("<span></span>").text(msg)
    return $(`<li data-id=${_id}>&nbsp;<span>${createdAt}</span></li>`).prepend(msg)
  }
  static addToDOM (data, type="append") {
    type==="prepend" ?
    $("#messages").prepend(this.toHTML(data)):
    $("#messages").append(this.toHTML(data)):
  }

  static getMsgs (uri, skip, limit) {
    // returns a promise, errors are catch
    return fetch(`${uri}/messages/${skip}/${limit}`)
      .then(data => data.json())
      .then(items => items.forEach(item => this.addToDOM(item)))
      .catch(err => console.log(err))
  }

  static getLastMsgs (uri) { return this.getMsgs(uri, 0,10) }

}


$(function () { // $(document).ready(
  let socketID = ""
  const socket = io(); //connects to / origin

  socket.on("socketID", id => socketID=id)

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
    let li, msg = $('#m').val()
    msg = new Msg(msg, new Date())
    li = msg.toHTML()
    //for the sender, append right away.
    $("#messages").append(li)
    socket.emit('chat message', { id:socketID, msg:msg })
    $('#m').val('')
    socket.on("message id", 
      id => { 
        li.attr("data-id", id)
        const btn = $(`<button>options</button>`)
        li.append(btn)
      })
    return false
  });

  socket.on('chat message', data => Msg.addToDOM(data))
})
