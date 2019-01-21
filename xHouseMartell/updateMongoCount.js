// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/testtable', (err, db) => {
//   if (err) console.error(err);
//   const Users = db.collection('users');

//   Users.find({}, (error) => {
//     if (error) console.error(error);
//   });
// });



// const mongo = require('mongodb').MongoClient;

// const url = 'mongodb://localhost/testtable';

// const dbName = 'testtable';

// mongo.connect(url, async (err, client) => {
//   const db = client.db(dbName);

//   const reviews = await db.collection('reviews_detail').aggregate([
//     {
//       $group:
//       {
//         _id: '$user_id',
//         count: { $sum: 1 }
//       }
//     }
//   ])
  
//   for (let i = 0; i < reviews.length; i++) {
//     await db.collection('users').update({_id: reviews[i]._id}, {
//       $set: {
//         count: reviews[i].count
//       }
//     })
//   }

//   await client.close();
// })


const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost/testtable';

const dbName = 'testtable';

mongo.connect(url, (err, client) => {
  const db = client.db(dbName);

  // db.collection('users').update({_id: 5}, {
  //   $set: {
  //     count: 23
  //   }
  // }).then(() => client.close());

  db.collection('reviews_detail').aggregate([
    {
      $group:
      {
        _id: '$user_id',
        count: { $sum: 1 }
      }
    }
  ]).toArray()
    // .then(reviews => {
    //   console.log(reviews.slice(0, 100))
    // })
    // .then(() => client.close())
    .then((reviews) => {
      // console.log(reviews.length);
      // reviews.sort((a, b) => a._id - b._id);
      for (let i = 70000; i < 110000; i++) {
        db.collection('users').updateOne({_id: reviews[i]._id}, {
          $set: {
            count: reviews[i].count
          }
        });
        // if (i % 50000 === 0) {
        //   console.log(i);
        // }

      }
    })
    .then(() => console.log('finisheddd'))
    .then(() => client.close());

  // function runThis(callback) {
  //   for (let i = 960001; i <= 1000000; i++) {
  //     let randNum = Math.floor(Math.random() * 10);
  //     db.collection('users').updateOne({ _id: i }, {
  //       $set: {
  //         count: randNum
  //       }
  //     })
  //   }
  //   callback()
  // }


  
  // runThis(() => {
  //   console.log('finisheddd');
  //   client.close();
  // })
}) 