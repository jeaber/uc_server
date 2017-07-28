// getting-started.js
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
mongoose.connect(process.env.mongodb);

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

