const express = require('express');
const fs = require('fs');
const app = express();

const google = require('googleapis');
var customsearch = google.customsearch('v1');
const resultMax = 10;
const resultMin = 1;

const search = require('./js/search');

const CSE_ID = process.env.CSE_ID;
const API_KEY = process.env.API_KEY;

//latest search route
app.get('/api/latest/imagesearch/', function(req, res) {
    search.display(res);
});

//user search route
app.get('/api/imagesearch/:search', function(req, res) {

  //retrieve current data/time  
  let date = new Date();
  let dateStr = date.toISOString();
  
  let numOfResult = req.query.offset;
  let terms = req.params.search;
  
  //log search
  search.log({"term": search, "when": dateStr});
  
  //check for invalid offset
  if(numOfResult > resultMax){
    numOfResult = resultMax;
  }else if(numOfResult < resultMin){
    numOfResult = resultMin;
  }
  
  //retrieve search results from google
  customsearch.cse.list({ cx: CSE_ID, auth: API_KEY, q: terms, num: numOfResult, searchType: 'image' }, function (err, resp) {
      if (err) {
        return console.log('An error occured', err);
      }
      
      //filter search results
     search.filter(resp.items)
    .then(function fulfilled(data){
       
       //return results to user after filtering
       res.send(data);
       
     }, function (err){
       if(err) throw err;
     });
  
  });
});

app.listen(process.env.PORT);
