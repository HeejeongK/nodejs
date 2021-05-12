var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 모듈을 사용할 것이다. 

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  
     ` ;

}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href= "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }

  list = list + '</ul>';
  return list;
}

var app = http.createServer(function (request, response) {
  //request는 요청할 때 웹브라우저가 보낸 정보 , response 응답할 떄 우리가 웹브라우저에 보낼 정보 

  var _url = request.url;   //그래서 여기url을 _url로 바꿔줌 
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  //위처럼 타이틀 변수 설정해 주어 아래 ${queryData.id} 이 부분을 ${title} 로 바꿔준다

  if (pathname === '/') {
    if (queryData.id === undefined) {

      fs.readdir('./data', function (err, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js'
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>
         ${description}`);
        response.writeHead(200);
        response.end(template);

      })


    } else {
      fs.readdir('./data', function (err, filelist) {

        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>
          ${description}`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function (err, filelist) {
      var title = 'WEB - create';

      var list = templateList(filelist);
      var template = templateHTML(title, list, `
        <form action="http://localhost:5000/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        <input type="submit">
        </p>
        </form>`);
      response.writeHead(200);
      response.end(template);

    });
    


  } else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){

    });
    request.on('end', function(data){

    });
    response.writeHead(200);
    response.end('success');


  }else {
    response.writeHead(404);
    response.end('Not found');
  }

  //console.log(__dirname + url);
  //response.end(fs.readFileSync(__dirname + _url));

});
app.listen(5000);