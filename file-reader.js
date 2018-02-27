var fs = require('fs')
, util = require('util')
, stream = require('stream')
, es = require('event-stream');

module.exports = FileReader;

function FileReader(){

}

FileReader.prototype.read = function(pathToFile, callback){
    var returnTxt = '';
    var s = fs.createReadStream(pathToFile)
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        s.pause();

        //console.log('reading line: '+line);
        returnTxt += line;        

        // resume the readstream, possibly from a callback
        s.resume();
    })
    .on('error', function(){
        console.log('Error while reading file.');
    })
    .on('end', function(){
        console.log('Read entire file.');
        callback(returnTxt);
    })
);
};

FileReader.prototype.readJSON = function(pathToFile, callback){
    try{
        this.read(pathToFile, function(txt){callback(null,JSON.parse(txt));});
    }
    catch(err){
        callback(err,null);
    }
};