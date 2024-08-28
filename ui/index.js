const http = require('http');
const { exec } = require('child_process');
const querystring = require('querystring');

// Define a function to decode URL-encoded strings
const decodeCommand = (command) => {
  return querystring.unescape(command);
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const hostname = req.headers.host.split(':')[0]; // Get the hostname from the Host header

    // Allow only requests with hostname 127.0.0.1
    if (hostname !== '127.0.0.1') {
      res.statusCode = 403; // Forbidden
      res.end('Access denied. Only requests with hostname 127.0.0.1 are allowed.');
      return;
    }

    let command = decodeCommand(req.url.substring(1)); // Remove leading '/' and decode the command

    exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
      if (error) {
        res.statusCode = 500;
        res.end(`Error executing command: ${error.message}`);
        return;
      }
      res.statusCode = 200; // OK
      res.setHeader('Content-Type', 'text/plain; charset=utf-8'); // Set UTF-8 charset
      res.write(stdout || stderr);
      res.end("执行成功，请关闭此页面。");
    });
  } else {
    res.statusCode = 405; // Method Not Allowed
    res.end('Only GET requests are allowed');
  }
});

const PORT = process.env.PORT || 1017;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
