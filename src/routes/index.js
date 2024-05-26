const logger = require('../logger');

var express = require('express');
var router = express.Router();

const Busboy = require('busboy');
const simpleParser = require('mailparser').simpleParser;

const emailProcessor = require('../services/emailProcessor');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.json({"message": "ok"})
});

router.post('/incoming-sendgrid', function(req, res) {
  const busboy = Busboy({ headers: req.headers });
  busboy.on('field', function(name, value) {
    if(name === "email") {
      simpleParser(value, {
        skipTextToHtml: true,
        skipImageLinks: true,
        skipTextLinks: true
      })
        .then(mail => {
          emailProcessor.processEmail(mail);
        })
        .catch(err => {
          logger.error('Error parsing email from Sendgrid.', err);
        })
    }
  })

  busboy.on('finish', function() {
    return res.json({"message": "ok"});
  });

  req.pipe(busboy);
})

module.exports = router;
