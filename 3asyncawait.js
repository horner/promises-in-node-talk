require('log-timestamp');


var http = require('http');
http.createServer(function (req, res) {
//  console.log("Got request");
  res.writeHead(200, {'Content-Type': 'text/plain'});
//  setTimeout(()=>{
    res.write('Hello World!');
    res.end();
//  },1000);
}).listen(8080);


const getContent = function(url, msg, tsbegin) {
    // return new pending promise
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const lib = url.startsWith('https') ? require('https') : require('http');
      const request = lib.get(url, (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
           reject(new Error('Failed to load page, status code: ' + response.statusCode));
         }
        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve([Date.now()-tsbegin, url, msg, body.join('')]));
      });
      // handle connection errors of the request
      request.on('error', (err) => reject({url,msg,err}))
      })
  };


async function testAwait() {
  var list = [];
  for (i = 0; i < 500; i++) { 
    list.push(getContent('http://localhost:8080/',i, Date.now()));
  }
  try {
    var log = await Promise.all(list);
    console.log(log);      
  } catch (error) {
    console.error("Error:",error);
  }
}

testAwait();

console.log("here");
//process.exit(1);
