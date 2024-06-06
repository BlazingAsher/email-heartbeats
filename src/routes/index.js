import logger from "../logger.js";

import express from "express";
import { simpleParser } from "mailparser";
import * as Busboy from "busboy";

import {processEmail} from "../services/emailProcessor.js";

var router = express.Router();

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
          processEmail(mail);
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

export default router;