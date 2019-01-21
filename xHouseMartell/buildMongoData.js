const fs = require('fs');
const faker = require('faker');

const mongoUserFile = fs.createWriteStream('./mongoUserData.csv');

const getInitials = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getRandomLetter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const initials = getRandomLetter() + getRandomLetter();
  return initials;
};

function writeUserData(writer, encoding = 'UTF-8', callback) {
  let i = 0;
  function write() {
    let ok = true;
    do {
      i += 1;
      const data = `${i},"${faker.internet.userName()}",${getInitials()},${faker.address.city()}\n`;

      if (i === 1000000) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i < 1000000 && ok);
    writer.once('drain', write);
  }
  write();
}

const begin = Date.now();

writeUserData(mongoUserFile, 'UTF-8', () => mongoUserFile.end());

mongoUserFile.on('finish', () => {
  const end = Date.now() - begin;
  console.log(`writeUserData took ${end} ms`);
});