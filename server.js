const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const api = require('./api/api')

let app = express()

app.use('/api', api)
app.use(serveStatic(path.join(__dirname, 'dist')))


let PORT = process.env.PORT || 5000

app.listen(PORT)
console.log('server started on port ' + PORT)
