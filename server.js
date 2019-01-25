const express = require('express')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./api/api')
const cookieParser = require('cookie-parser')
const history = require('connect-history-api-fallback');
// const connect = require('connect')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(history());


app.use('/api', api)

app.use(serveStatic(path.join(__dirname, 'dist')))


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('server started on port ' + PORT)
})
