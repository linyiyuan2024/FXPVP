const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

// Default whitelist: Localhost and local network IP ranges
const defaultWhitelist = ['127.0.0.1', '::1'];
const localIPs = getLocalIPs(); // Get local network IPs
const whitelist = new Set([...defaultWhitelist, ...localIPs]);

// Load additional IPs from whitelist.txt
fs.readFile('whitelist.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading whitelist.txt:', err.message);
  } else {
    data.split('\n').forEach(line => {
      const ip = line.trim();
      if (ip) {
        whitelist.add(ip);
      }
    });
  }
});

// Get local IP addresses
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const localIPs = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIPs.push(iface.address);
      }
    }
  }
  return localIPs;
}

const server = http.createServer((req, res) => {
  const clientIP = req.socket.remoteAddress;

  if (!whitelist.has(clientIP)) {
    res.statusCode = 403; // Forbidden
    res.end('Your IP is not allowed to access this server.');
    return;
  }

  if (req.method === 'GET') {
    const decodedURL = decodeURIComponent(req.url); // Decode URL-encoded characters
    const command = decodedURL.substring(1); // Remove leading '/'

    exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
      if (error) {
        res.statusCode = 500;
        res.end(`Error executing command: ${error.message}`);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
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
