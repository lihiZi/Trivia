var express = require('express');
var router = express.Router();
const fs = require('fs');





router.get('/api/read', function(req, res, next) {

  let dataJson = fs.readFileSync('questions.json', 'utf8')
  res.json(JSON.parse(dataJson))
  
  });
  
  module.exports = router;
