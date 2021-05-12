var testFolder = './data/';  //실행하는 위치에 따라 경로 지정
var fs = require('fs');

fs.readFile(testFolder, function(err, filelist){
    console.log(filelist);
}) 