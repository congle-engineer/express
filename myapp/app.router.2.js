const express = require('express')
const app = express()
const router = express.Router()

router.use((req, res, next) => {
  if (!req.header['x-auth']) {
    return next('router')
  }
  next()
})

router.get('/user/:id', (req, res) => {
  res.send('Hello, user!')
})

app.use('/admin', router, (req, res) => {
  res.sendStatus(401)
})

app.listen(3000, () => {
  console.log('Start listening port 3000!')
})
