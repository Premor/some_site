var FileReader= require('./file-reader');
var fs = require('fs')
var FR = new FileReader();
//FR.readJSON(__dirname + '/courses.json',function(data){
//    console.log(data[5].program);
//})
fs.readFile('./courses.json',function(err,data){
    if (err)
        console.log(err)
    console.log(data.toString('utf-8'))
})
