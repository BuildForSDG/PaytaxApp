/* eslint-disable linebreak-style */
const express = require('express');

const app = express();

const cors = require('cors');
const path = require('path');

const usersRouter = require('./routes/users');
const paymentsRouter = require('./routes/payments');
const gatewayRouter = require('./routes/gateway');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.get('/', (req, res) => {
  res.send('welcome!');
});
// api routes
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/gateway', gatewayRouter);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(res.status(400).json({
    status: false,
    data: 'Bad request'
  }));
});

// error handler
app.use((err, req, res) => {
  // render the error page
  res.status(err.status || 500).json({
    status: false,
    data: 'internal server error'
  });
});


module.exports = app;
