require('dotenv/config');
const { google } = require('googleapis');
const { createServer } = require('http');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8569'
);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Open the link to continue:', url);

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:8569');
  const code = url.searchParams.get('code');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
  } catch (error) {}

  res.writeHead(200);
  res.end('ok');

  process.exit();
}).listen(8569);
