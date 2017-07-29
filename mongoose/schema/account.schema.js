var mongoose = require('mongoose');

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
			date: { type: Date},
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
module.exports = {
	accountSchema: accountSchema,
}