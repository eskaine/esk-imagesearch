const fs = require('fs');
const file = './file/latest.json';
const format = 'utf8';
const latestMaxLength = 10;

var search = {
  display: display,
  log: log,
  filter: filter
}

module.exports = search;

//Functions

//display latest search
function display(res) {
  
  //get data from json file
  fs.readFile(file, format, function(err, data){
    
    if(err) throw err;
    
    //parse data from file
    data = JSON.parse(data);
    
    res.send(JSON.stringify(data));
  });
}

//save user search params to file
function log(newData) {
  
  //get data from json file
  fs.readFile(file, format, function(err, data) { 
    
    if(err) throw err;
    
    //parse data from file
    data = JSON.parse(data);
   
    //remove earliest entry if data array at max of 10
    if(data.length === latestMaxLength) {
      data.pop();
    }
    
    //add latest data to the front of array
    data.unshift(newData);
    
    //overwrite file with updated data array
    fs.writeFile(file, JSON.stringify(data), format, function (err){
      if (err) throw err;
    });
  });
}

// filter google search results
function filter(dataArr) {
  
  // return resolved promise
  return new Promise(function(resolve, reject){
    
    if(dataArr === undefined) {
      reject();
    }
   
    //initialize array for use
    var arr = [];
    
    //filter unwanted data
    for(var i=0, n=dataArr.length; i<n; i++){
      
      let userData = {"url": dataArr[i]["link"], "snippet": dataArr[i]["snippet"], "thumbnail": dataArr[i]["image"]["thumbnailLink"], "context": dataArr[i]["image"]["contextLink"]};
      arr.push(userData);
      
      //resolve promise at end of filtering
      if(i === dataArr.length-1){
        resolve(arr);
      }
    
    }
  });
}