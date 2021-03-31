/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

const path = require('path');

const usersRouter = require('./v1/routes/users');
const paymentsRouter = require('./v1/routes/payments');
const gatewayRouter = require('./v1/routes/gateway');

const usersRouterV2 = require('./v2/routes/users');
const paymentsRouterV2 = require('./v2/routes/payments');
const gatewayRouterV2 = require('./v2/routes/gateway');

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
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/gateways', gatewayRouter);

app.use('/api/v2/users', usersRouterV2);
app.use('/api/v2/payments', paymentsRouterV2);
app.use('/api/v2/gateways', gatewayRouterV2);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/learnerkia', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log('docker mongodb container conneted!')).catch((err) => console.log(err));
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
