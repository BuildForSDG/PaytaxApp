/* eslint-disable linebreak-style */
const express = require('express');

const app = express();

const cors = require('cors');

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
  
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

app.get('/', (req, res) => {
  res.send('welcome!');
});
// api routes
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/gateway', gatewayRouter);

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
