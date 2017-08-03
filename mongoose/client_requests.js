var m = require('./index.js');
var mg = require('./../mailgun');

var auth = function (credentials, socket, ip) {
	m.Account.findOne(credentials, function (err, data) {
		console.log(data);
		// TODO
		// check ip
		// send email
		if (data) {
			if (socket) {
				socket.emit('auth', true);
				socket.emit('emailVerified', data['email_verified']);
				if (data['account'])
					socket.emit('accountData', data['account']);
				// DO NOT SEND PINS TODO
				if (data['funding'])
					socket.emit('fundingData', data['funding']);
			}
		} else {
			if (socket) {
				socket.emit('auth', false);
			}
		}
	});
}
var verifyBank = function (data, socket) {
	// {one: '0.00',two: '0.12'}
}
var verifyEmail = function (credentials, pin, socket) {
	console.log(credentials, pin)
	m.Account.findOne(credentials, 'emailPin', function (err, data) {
		if (data) {
			console.log("verify pin", data);
			if (data.emailPin === pin) {
				m.Account.update(
					credentials,
					{
						email_verified: true,
						emailPin: ''
					},
					function (err, result) {
						if (err) console.log("ERR", err);
						if (result) {
							console.log('updated ip', result);
							socket.emit('notification', { message: 'Email verified.', type: 'success' })
						}
					});
			} else {
				socket.emit('notification', { message: 'Pin incorrect. Please check it again.', type: 'error' })
			}
		}
	});
}
var accountForm = function (data, socket, clientIp) {
	data.email_verified = false;
	data.active = false;
	data.ip = clientIp;
	console.log(data);

	console.log(typeof clientIp, clientIp)
	m.Account.update(
		{ email: data.email },
		{ $setOnInsert: data },
		{ upsert: true },
		function (err, result) {
			if (err) console.log("ERR", err);
			if (result) {
				console.log(result);
				mg.verifyEmail(data.email);
				m.Account.update(
					{ email: data.email },
					{ $addToSet: { known_ips: clientIp } },
					function (err, result) {
						if (err) console.log("ERR", err);
						if (result) {
							console.log('updated ip', result);
						}
					});
			}
		});
}
var contactForm = function (data, account, socket) {
	m.Account.findOneAndUpdate(
		{
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			password: account.password
		},
		{ contact: data },
		{ upsert: true },
		function (err, result) {
			if (err) console.log("ERR", err);
			if (result) {
				console.log(result);
			}
		});
}
var fundingForm = function (data, account, socket) {
	data.authorized = true;
	data.verified = false;
	m.Account.findOneAndUpdate(
		{
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			password: account.password
		},
		{ funding: data },
		{ upsert: true },
		function (err, result) {
			if (err) console.log("ERR", err);
			if (result) {
				console.log(result);
			}
		});
}
var achDeposit = function (credentials, data, socket) {

}
var achWithdrawal = function (credentials, data, socket) {

}
module.exports = {
	auth: auth,
	verifyBank: verifyBank,
	verifyEmail: verifyEmail,
	accountForm: accountForm,
	contactForm: contactForm,
	fundingForm: fundingForm,
	achDeposit: achDeposit,
	achWithdrawal: achWithdrawal
}