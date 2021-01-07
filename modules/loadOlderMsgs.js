const router = require("express").Router()
const { findMessages } = require("./dbcrud")

router.get("/:skip/:limit", (req, res) => {
  const { skip, limit } = req.params
  findMessages(skip, limit, (err, doc) => err ? 
      res.status(500)
      .json({ err: err.message }): 
      res.json(doc)
  )})

module.exports = router
