require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const models = require('./models/index.js');
const routes = require('./routes');

const connectToDB = async () => {
  // TODO: turn force off!! At least outside of dev
  const FORCE_SYNC_DB = false;
  await models.sequelize.sync({ force: FORCE_SYNC_DB });
};
connectToDB();

const server = express();
server.name = 'HENRY_PEER_REVIEW_API';

server.use(fileUpload({ useTempFiles: true }));

server.use(cors({
  origin: `${process.env.URI_FRONTEND}`,
  credentials: true,
}));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.URI_FRONTEND}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // TODO: restrict methods to those we use?
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

server.use('/', routes);

// Error catching endware
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err); // eslint-disable-line no-console
  res.status(status).send(message);
});

module.exports = server;
