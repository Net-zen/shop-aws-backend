const express = require('express')
require('dotenv').config()
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.all('/*', (req, res) => {
  console.log('originalUrl', req.originalUrl)
  console.log('method', req.method)
  console.log('body', req.body)

  const recipient = req.originalUrl.split('/')[1]
  console.log('recipient', recipient)

  const recipientUrl = process.env[recipient]
  console.log('recipientUrl', recipientUrl)

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
    }
    console.log('axiosConfig', axiosConfig)

    axios(axiosConfig)
      .then(response => {
        console.log('response', response)
        res.json(response.data)
      })
      .catch(error => {
        console.log('error', error)

        if (error.response) {
          const { status, data } = error.response
          res.status(status).json(data)
        } else {
          res.status(500).json({message: 'Internal server error'})
        }
      })
  } else {
    res.status(502).json({message: 'Cannot process request'})
  }
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
