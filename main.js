var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는 모듈을 사용할 것이다. 
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHTML = require('sanitize-html');

//아래 template을 모듈로 빼고 (lib/template.js) 받아서 활용~
/* var template = {
  HTML: function(title, list, body, control) {
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
      ${control}
      ${body}
    </body>
    </html>   
       ` ; 
  }, List:function(filelist){
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href= "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }
  } */

/* function templateHTML(title, list, body, control) {
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
    ${control}
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
} */

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
     
     /* var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>
         ${description}`, `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(template);  원래 코드 아래 코드는 함수 이용해서 변경*/

        var list = template.List(filelist);
        var html = template.HTML(title, list,
           `<h2>${title}</h2> ${description}`,
           `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir('./data', function (err, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var sanitizedTitle = sanitizeHTML(title);
          var sanitizedDescription = sanitizeHTML(description);
          var list = template.List(filelist);
          var html = template.HTML(sanitizedTitle, list, 
            `<h2>${sanitizedTitle}</h2> ${sanitizedDescription}`,
          ` <a href="/create">create</a> 
            <a href="/update?id=${sanitizedTitle}">update</a>
           <form action="delete_process" method="post" >
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
           </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }

  } else if (pathname === '/create') {
    fs.readdir('./data', function (err, filelist) {
      var title = 'WEB - create';

      var list = template.List(filelist);
      var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
        <input type="submit">
        </p>
        </form>`,'');
      response.writeHead(200);
      response.end(html);
    });
    
  } else if(pathname === '/create_process'){
    var body = '';
    request.on('data', function(data){
        //웹브라우저가 post방식으로 데이터를 전송할 때 엄청 많으면 데이터 한번에 처리하다보면 무리하면 컴터 꺼짐 그거에 대비해서 요렇게 사용방법을 제공
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      //쿼리스트링이라는 모듈의 parse를 객체화 할 수 있다
    
      var title = post.title;
      var description = post.description;
      
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`}); //200은 성공 302는 다른 페이지로 리다이렉션
          response.end();
      })        
    }); 
    
  }else if(pathname === '/update'){
    fs.readdir('./data', function (err, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = template.List(filelist);
        var html = template.HTML(title, list,
        `
        <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
        <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
        <input type="submit">
        </p>
        </form> 
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      //console.log(post);
       fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`}); //200은 성공 302는 다른 페이지로 리다이렉션
          response.end();
        }); 
      });        
    });

  } else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      
      fs.unlink(`data/${filteredId}`, function(error){
        response.writeHead(302, {location: `/`});
        response.end();
      });       
    });

  }else {
    response.writeHead(404);
    response.end('Not found');
  }
  //console.log(__dirname + url);
  //response.end(fs.readFileSync(__dirname + _url));
});
app.listen(5050);