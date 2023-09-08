/**
 * Colors:
 * 11 - Red
 * 10 - Green
 * 9 - blue
 * 8 - gray
 * 7 - cyan
 * 6 - orange
 * 5 - yellow
 * 4 - light red
 * 3 - purple
 * 2 - light blue/green
 * 1 - light blue
 */

const subjects = require('./subjects');

module.exports = (title) => {
  for (const subject of subjects)
    if (title.match(subject.match)) return subject.color;

  return 8;
};
