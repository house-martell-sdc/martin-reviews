const fs = require('fs');
const faker = require('faker');
const dateFns = require('date-fns');

const restaurantFile = fs.createWriteStream('./restaurantData.csv');
const userFile = fs.createWriteStream('./userData.csv');
const reviewFiltersFile = fs.createWriteStream('./reviewFiltersData.csv');
const reviewsDetailFile = fs.createWriteStream('./reviewsDetailData.csv');

function writeRestaurantData(writer, encoding, callback) {
  let i = 1000000;
  function write() {
    let ok = true;
    do {
      const data = `"${faker.company.companyName()}${i}"\n`;

      i -= 1;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    writer.once('drain', write);
  }
  write();
}

const getInitials = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getRandomLetter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const initials = getRandomLetter() + getRandomLetter();
  return initials;
};

function writeUserData(writer, encoding = 'UTF-8', callback) {
  let i = 1000000;
  function write() {
    let ok = true;
    do {
      const data = `"${faker.internet.userName()}",${getInitials()},${faker.address.city()}\n`;

      i -= 1;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    writer.once('drain', write);
  }
  write();
}

function writeReviewFiltersData(writer, encoding = 'UTF-8', callback) {
  let i = 0;
  function write() {
    let ok = true;
    do {
      i += 1;
      const filters = ['Burgers', 'Burritos', 'Pizzas', 'Tacos', 'Sandwiches'];
      for (let j = 0; j < filters.length; j += 1) {
        const data = `${i},${filters[j]}\n`;
        if (i === 1000000) {
          writer.write(data, encoding, callback);
        } else {
          ok = writer.write(data, encoding);
        }
      }
    } while (i < 1000000 && ok);
    writer.once('drain', write);
  }
  write();
}

const getRandomDate = () => {
  const start = new Date(2018, 0, 1);
  const now = new Date();
  return new Date(start.getTime() + Math.random() * (now.getTime() - start.getTime()));
};

function writeReviewsDetailData(writer, encoding = 'UTF-8', callback) {
  let i = 0;
  function write() {
    let ok = true;
    do {
      i += 1;
      if (i <= 9000000) {
        var data = `${Math.floor(Math.random() * 900001) + 1},${Math.floor(Math.random() * 1000000) + 1},${faker.lorem.sentences()},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6) >= 3 ? 1 : 0},${dateFns.format(getRandomDate(), 'YYYY-MM-DD')}\n`;
      } else if (i > 9000000) {
        var data = `${Math.floor(Math.random() * (1000000 - 900001 + 1)) + 900001},${Math.floor(Math.random() * 1000000) + 1},${faker.lorem.sentences()},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6)},${Math.floor(Math.random() * 6) >= 3 ? 1 : 0},${dateFns.format(getRandomDate(), 'YYYY-MM-DD')}\n`;
      }
      if (i === 10000000) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i < 10000000 && ok);
    writer.once('drain', write);
  }
  write();
}

const begin = Date.now();

writeRestaurantData(restaurantFile, 'UTF-8', () => restaurantFile.end());
writeUserData(userFile, 'UTF-8', () => userFile.end());
writeReviewFiltersData(reviewFiltersFile, 'UTF-8', () => reviewFiltersFile.end());
writeReviewsDetailData(reviewsDetailFile, 'UTF-8', () => reviewsDetailFile.end());

restaurantFile.on('finish', () => {
  const end = Date.now() - begin;
  console.log(`writeRestaurantData took ${end} ms`);
});

userFile.on('finish', () => {
  const end = Date.now() - begin;
  console.log(`writeUserData took ${end} ms`);
});

reviewFiltersFile.on('finish', () => {
  const end = Date.now() - begin;
  console.log(`writeReviewFiltersData took ${end} ms`);
});

reviewsDetailFile.on('finish', () => {
  const end = Date.now() - begin;
  console.log(`writeReviewsDetailData took ${end} ms`);
});

// function writeOneMillionTimes(writer, data, encoding, callback) {
//   let i = 1000000;
//   write();
//   function write() {
//     let ok = true;
//     do {
//       i--;
//       if (i === 0) {
//         // last time!
//         writer.write(data, encoding, callback);
//       } else {
//         // see if we should continue, or wait
//         // don't pass the callback, because we're not done yet.
//         ok = writer.write(data, encoding);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       // had to stop early!
//       // write some more once it drains
//       writer.once('drain', write);
//     }
//   }
// }
