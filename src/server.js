/* eslint-disable linebreak-style */
const createError = require('http-errors');
const express = require('express');

const app = express();

const usersRouter = require('./routes/users');
const paymentsRouter = require('./routes/payments');
const gatewayRouter = require('./routes/gateway');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('welcome!');
});
// api routes
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/gateway', gatewayRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // render the error page
  res.status(err.status || 500);
  res.json('error');
});


module.exports = app;
