const express = require('express')

const app = express()

const auth = {
  login: 'bsdex',
  password: 'challenge',
}

app.use((req, res, next) => {
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  res.status(401).send('Authentication required.') // custom message
})

app.get('/markets', (req, res) => {
  res.sendFile(`${__dirname}/data/markets.json`)
})

const random = (min, max, decimals = 2) =>
  Math.round((Math.random() * (max - min) + min) * Math.pow(10, decimals)) /
  Math.pow(10, decimals)

app.get('/prices', (req, res) => {
  return res.json({
    'btc-eur': random(8200, 8400),
    'eth-eur': random(190, 220),
    'ltc-eur': random(35, 45),
    'xrp-eur': random(0.1, 0.3),
  })
})

app.use((req, res) => {
  res.sendStatus(404)
})

app.listen(3030, () => {
  console.log('Server running on http://localhost:3030')
})
