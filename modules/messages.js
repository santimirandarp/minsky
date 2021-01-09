const bodyParser  = require("body-parser")
var jsonParser = bodyParser.json()

const router = require("express").Router()
const { findMessages } = require("./dbcrud")

router.get("/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params
  findMessages(skip, limit, (err, doc) => err ? 
      res.status(500)
      .json({ err: err.message }): 
      res.json(doc)
  )})

router.post("/delete", jsonParser, (req, res) => {
  const { _id } = req.body
  deleteMessages(_id, (err, doc) => err ? 
      res.status(500)
      .json({ err: err.message }): 
      res.json(doc)
  )})

module.exports = router
