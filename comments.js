// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var comments = require('./comments.json');

// Create server
http.createServer(function (req, res) {
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function () {
      var comment = qs.parse(body);
      comments.push(comment);
      fs.writeFile('./comments.json', JSON.stringify(comments), function (err) {
        if (err) console.error(err);
      });
    });
  }

  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function (exists) {
    if (!exists) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.write('404 Not Found\n');
      res.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, 'binary', function (err, file) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.write(err + '\n');
        res.end();
        return;
      }

      res.writeHead(200);
      res.write(file, 'binary');
      res.end();
    });
  });
}).listen(3000);
console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
//End Solution