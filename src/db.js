/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable global-require */
const dotenv = require('dotenv');

dotenv.config();
const mongodb = require('mongodb');

// console.log(process.env);

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    // eslint-disable-next-line indent
      console.log(err);
  }
  module.exports = client;
  const app = require('./server');
  console.log(`listening on port ${process.env.PORT}`);
  app.listen(process.env.PORT);
});
