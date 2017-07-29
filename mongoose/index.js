// getting-started.js
var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
mongoose.connect(process.env.mongodb);
//process.env.mongodb
//'mongodb://wrtI7xCmI8PeHbxJ:bN4POcna8pYSDjOd@cluster0-shard-00-00-yweiu.mongodb.net:27017,cluster0-shard-00-01-yweiu.mongodb.net:27017,cluster0-shard-00-02-yweiu.mongodb.net:27017/account?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
});

var accountSchema = mongoose.Schema({
	email: { type: String, unique: true },
	firstName: { type: String },
	lastName: { type: String },
	password: { type: String },
	email_verified: { type: Boolean },
	// DO NOT SEND TO CLIENT
	pin: { type: String },
	active: { type: Boolean },
	ip_addresses: [Number],
	contact: {
		streetAddress: { type: String },
		city: { type: String },
		state: { type: String },
		postalCode: { type: Number },
		phone: { type: Number }
	},
	funding: {
		accountType: { type: String, unique: true },
		accountNumber: { type: Number },
		routingNumber: { type: Number },
		authorized: { type: Boolean },
		verified: { type: Boolean },
		// DO NOT SEND TO CLIENT
		verification_amounts: {
			one: { type: String },
			two: { type: String }
		},
		scheduled_withdrawals: {
			date: { type: Date },
			amount: { type: Number }
		},
		scheduled_deposits: {
			date: { type: Date },
			amount: { type: Number }
		},
	},
	account: {
		account_number: { type: String },
		updated_at: { type: String },
		created_at: { type: String },
		balance: { type: Number },
		payouts: [Number]
	}
});
var Account = mongoose.model('Account', accountSchema);
// require('./schema/account.schema').accountSchema
// console.log(require('./schema/account.schema').accountSchema)
var encKey = process.env.encKey;
var sigKey = process.env.sigKey;

module.exports = {
	Account: Account,
	mongoose: mongoose,
	db: db
}