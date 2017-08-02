// require Subledger module
require('dotenv').config();

var Subledger = require('subledger').Subledger;
var m = require('./../mongoose/index.js');
// instantiate it
var subledger = new Subledger();

var account = {
	"description": name,
	"reference": url,
	"normal_balance": "credit"
}
subledger.setCredentials(process.env.keyid, process.env.keysecret);
//create account
var createAccount = function (name, email) {
	subledger.org(process.env.ucmain_id).book(process.env.book_clientmain).account().create(account, function (error, response) {
		console.log(response);
		m.Account.findOneandUpdate(
			{
				email: email,
				'account.account_number': { $exists: false }
			},
			{
				'account.account_number': response.active_account.id,
				'account.updated_at': new Date(),
				'account.created_at': new Date(),
				'account.balance': '0',
			},
			{ upsert: true },
			function (err, result) {
				if (err) console.log("ERR", err);
				if (result) {
					console.log(result);
					// mg.verifyEmail(data.email, pin);
				}
			});
	});
}
module.exports = createAccount;

