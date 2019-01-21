const fs = require('fs');
const path = require('path');

let string = '';

const updateCount = () => {
  for (let i = 1; i <= 1000000; i += 1) {
    string += `UPDATE users SET review_count = count(rd.user_id) FROM reviews_detail rd JOIN users u ON rd.user_id = u.id WHERE u.id = ${i};\n`;
  }
};

updateCount();

fs.writeFile(path.join(__dirname, 'updateCount.sql'), string, (err) => {
  if (err) { console.error(err); }
});
