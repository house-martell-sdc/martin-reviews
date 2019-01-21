'use strict';

function generateRandomData(context, events, done) {
  const min = Math.ceil(900000);
  const max = Math.floor(1000000);

  const newId = Math.floor(Math.random() * (max - min + 1)) + min;

  context.vars['id'] = newId;

  return done();
}

module.exports = {
  generateRandomData,
};
