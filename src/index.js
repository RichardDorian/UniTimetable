require('dotenv/config');
const { google } = require('googleapis');
const { writeFileSync } = require('node:fs');

const getOauth2Client = require('./autha');
let users = require('../users.json');
const colors = require('./colors');
const hashEvents = require('./hash');
const name = require('./name');

function writeTimetableHash(userId, hash) {
  users[userId].timetableHash = hash;
  writeFileSync('users.json', JSON.stringify(users, null, 2));
}

(async () => {
  for (let id = 0; id < users.length; id++) {
    const user = users[id];

    const oauth2Client = await getOauth2Client(user.refreshToken);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const rawEvents = await calendar.events.list({
      calendarId: user.sourceCalendar,
      timeMin: new Date().toISOString(),
    });

    console.log(`Found, ${rawEvents.data.items.length} upcoming events`);

    const existingEvents = await calendar.events.list({
      calendarId: user.targetCalendar,
      timeMin: new Date().toISOString(),
    });

    console.log(`Found, ${existingEvents.data.items.length} existing events`);

    const timetableHash = hashEvents(rawEvents.data.items);
    console.log('Saved timetable hash:', user.timetableHash);
    console.log('  New timetable hash:', timetableHash);

    if (timetableHash !== user.timetableHash) {
      writeTimetableHash(id, timetableHash);

      // Delete all existing events
      console.log('Deleting existing events');
      for (const event of existingEvents.data.items) {
        await calendar.events.delete({
          calendarId: user.targetCalendar,
          eventId: event.id,
        });
      }

      // Insert new events
      console.log('Inserting new events');
      for (const event of rawEvents.data.items) {
        await calendar.events.insert({
          calendarId: user.targetCalendar,
          requestBody: {
            summary: name(event.summary.trim()),
            location: event.location.trim(),
            start: event.start,
            end: event.end,
            colorId: colors(event.summary),
          },
        });
      }
    } else {
      console.log('No changes to do, exiting');
    }
  }
})();
