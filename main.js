var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 모듈을 사용할 것이다. 

var app = http.createServer(function(request,response){
    var _url = request.url;   //그래서 여기url을 _url로 바꿔줌 
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    //위처럼 타이틀 변수 설정해 주어 아래 ${queryData.id} 이 부분을 ${title} 로 바꿔준다
      
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
     // var description = data;
      
       var template = `
      <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    <ol>
      <li><a href="/?id=HTML">HTML</a></li>
      <li><a href="/?id=CSS">CSS</a></li>
      <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ol>
    <h2>${title}</h2>   
    <p>${description}</p>
  </body>
  </html>
  
      `;
      response.writeHead(200);
      response.end(template)

    })

    //console.log(__dirname + url);
    //response.end(fs.readFileSync(__dirname + _url));
 
});
app.listen(5000);