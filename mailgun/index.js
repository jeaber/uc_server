var verifyEmail = require('./verifyEmail').verify;
var newLogin = require('./verifyEmail').newLogin;

var achTransfer = require('./achTransfer');
var bankUpdated = require('./bankUpdated');

var payout = require('./payout');
// verifyEmail('jeaber@gmail.com', '123456')

module.exports = {
	verifyEmail: verifyEmail, // {email,pin}
	newLogin: newLogin, // {email,pin}
	achTransfer: achTransfer, // {email, type, amount, name}
	bankUpdated: bankUpdated, // {email, name}
	payout: payout // {email, amount}
}