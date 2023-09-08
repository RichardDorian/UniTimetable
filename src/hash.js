const { createHash } = require('node:crypto');

module.exports = (items) => {
  const hash = createHash('sha256');

  for (const item of items) {
    hash.update(item.summary);
    hash.update(item.start.dateTime);
    hash.update(item.end.dateTime);
    hash.update(item.description);
    hash.update(item.location);
  }

  return hash.digest('hex');
};
