const subjects = require('./subjects');

module.exports = (title) => {
  let displayTitle = [];

  if (title.includes('TD')) displayTitle.push('TD');
  else if (title.includes('TP')) displayTitle.push('TP');

  for (const subject of subjects) {
    if (title.match(subject.match)) {
      displayTitle.push(subject.name);
      break;
    }
  }

  return displayTitle.join(' ');
};
