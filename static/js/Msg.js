class Msg {
  constructor (msg, createdAt){
    this.msg = msg
    this.createdAt = createdAt
  }
  toHTML (own=false){
  const dropdownElement = `
    <div class="dropdown">
    <p class="options">options</p>
    <div class="operations">
    <p class="delete">Delete</p>
    <p class="update">Update</p>
    </div>
  </div>`
   let createdAt = (new Date(this.createdAt))
      .toTimeString()//improves the format
      .substr(0,5) //first 5 symbols (0,1,2,3,4)
   let msg = $("<span></span>").text(this.msg)//ensure it's text
       msg = $(`<li data-id=${this._id}>&nbsp;<span class="time">${createdAt}</span></li>`).prepend(msg)
   if(!own) return msg
   return msg.append(dropdownElement)
  }

  static toHTML ({ msg, createdAt, _id }) {
    // pass object, builds list item.
    createdAt = (new Date(createdAt))
      .toTimeString()
      .substr(0,5)
    //creates span, includes plain text on it
    msg = $("<span></span>").text(msg)
    return $(`<li data-id=${_id}>&nbsp;<span class="time">${createdAt}</span></li>`).prepend(msg)
  }

  static addToDOM (data, type="append") {
    type==="prepend" ?
    $("#messages").prepend(this.toHTML(data)):
    $("#messages").append(this.toHTML(data))
  }

  static getMsgs (uri, skip, limit) {
    // returns a promise, errors are catch
    return fetch(`${uri}/messages/${skip}/${limit}`)
      .then(data => data.json())
      .then(items => items.forEach(item => this.addToDOM(item, "prepend")))
      .catch(err => console.log(err))
  }
  static getLastMsgs (uri) { return this.getMsgs(uri, 0,10) }
  

}

