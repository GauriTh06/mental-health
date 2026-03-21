const http = require('http');

const data = JSON.stringify({
  round1_score: 10,
  round2_score: 20,
  answers: { round1: {}, round2: {} }
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/assessment',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  res.on('data', d => process.stdout.write(d));
});

req.write(data);
req.end();
