const express = require('express');
const path = require('path')
const validator = require('validator').default
const { mailer, useHerokuRedirectHTTPS } = require('./middlewares')

require("dotenv").config()
const app = express() ;

const PORT = process.env.PORT || 3000
const MODE = process.env.NODE_ENV || 'development' 

app.use(express.static('public')) ;
app.use(useHerokuRedirectHTTPS(MODE)) ;



app.post(
    '/contact',
    express.urlencoded({
        extended: true
    }),
    mailer('Amidat Mustapha'),
    (req, res) => {
      const { name, email, subject, message } = req.body

  
      if (
        validator.isEmpty(name) ||
        validator.isEmpty(email) ||
        validator.isEmpty(message) || 
        validator.isEmpty(subject)
      ) {
        res.status(400).send('Missing required fields')
      } else if (!validator.isEmail(email)) {
        res.status(400).send('Supplied email is invalid')
      } else {
        res
          .mailer(email, name)
          .then(() => {
            res.send(`message to ${email}, kindly check your inbox`)
          })
          .catch((error) => {
            console.error(error)
            res.status(500).send('A serve erroor occured')
          })
      }
    }
  )
  

app.listen(PORT, () => {
    console.log(`app is up and running on ${PORT}}`) 
})
