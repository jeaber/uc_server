var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    compress = require('compression');
var http = require('http'),
    errorhandler = require('errorhandler'),
    cors = require('cors'),
    logger = require('morgan');
var bodyParser = require('body-parser');
//var braintreeRoutes = require('./braintree');
//var market = require('./market');
//var dwolla = require('./dwolla');
//var noodle = require('./noodle');
require('dotenv').config();

var R = require('ramda');
var m = require('./mongoose');
// CONFIG SERVER
var config = {
    build_dir: './dist',
    // Dev server port
    port: 3999
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function (err, req, res, next) {
    if (err.name === 'StatusError') {
        res.send(err.status, err.message);
    } else {
        next(err);
    }
});

var clientRequests = require('./mongoose/client_requests');
// var loop = require('./loop');
io.on('connection', function (socket) {
    try {
        var authenticated = false;
        var credentials = {
            email: '',
            password: ''
        };
        var orders;
        var accounts;
        var positions;
        // {'email','password'}
        socket.on('auth', function (data) {
            credentials = data;
            authenticated = clientRequests.auth(credentials, socket);
            clientRequests.accountData(credentials, socket);
        });

        socket.on('accountform', function (account) { clientRequests.accountForm(account); });
        socket.on('contactform', function (data, account) { clientRequests.contactForm(data, account); });
        socket.on('fundingform', function (data, account) { clientRequests.fundingForm(data, account); });

        socket.on('verifyBank', function (data) { clientRequests.verifyBank(data); }); // {'00.12, '00.22'}
        socket.on('verifyEmail', function (data) { clientRequests.verifyEmail(data); });

        socket.on('achDeposit', function (data) { clientRequests.achDeposit(data); });
        socket.on('achWithdrawal', function (data) { clientRequests.achWithdrawal(data); });
        
    } catch (e) {
        console.log(e);
    }
});
app.use(compress());
app.use(express.static(config.build_dir));

// FIRE IT UP
server.listen(config.port, function () {
    console.log("Express server listening on port %d", config.port);
});