// test_live.js — Test the /api/live serverless function locally.
// Usage: CRICAPI_KEY=your-key-here node test_live.js

const handler = require('./api/live.js');

(async () => {
  if (!process.env.CRICAPI_KEY) {
    console.warn('⚠ Set CRICAPI_KEY env var. Example:');
    console.warn('  $env:CRICAPI_KEY="your-key"; node test_live.js');
    console.warn('  (Get a free key at https://cricketdata.org)\n');
  }

  const mockReq = { method: 'GET' };
  const mockRes = {
    statusCode: 0,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(s) { this.statusCode = s; return this; },
    json(obj) {
      console.log(`\nStatus: ${this.statusCode}`);
      console.log('Response JSON:', JSON.stringify(obj, null, 2));
    },
    end() { console.log('End of response'); }
  };
  await handler(mockReq, mockRes);
})();
