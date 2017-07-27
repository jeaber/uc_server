// getting-started.js
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
mongoose.connect('mongodb://wrtI7xCmI8PeHbxJ:TVjONUIRt6fQUJfj@cluster0-shard-00-00-yweiu.mongodb.net:27017,cluster0-shard-00-01-yweiu.mongodb.net:27017,cluster0-shard-00-02-yweiu.mongodb.net:27017/UPCRUE?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
});

var Account = mongoose.model('Account', require('./schema/account.schema'));

var encKey = process.env.encKey;
var sigKey = process.env.sigKey;

module.exports = {
	Account: Account,
	mongoose: mongoose,
	db: db
}

