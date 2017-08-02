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
				if (data['account'])
					socket.emit('account', data['account']);
				// DO NOT SEND PINS TODO
				if (data['funding'])
					socket.emit('funding', data['funding']);
			}
		} else {
			if (socket) {
				socket.emit('auth', false);
			}
		}
	});
}
var accountData = function (credentials, socket) {
	/*	m.Account.find(credentials, function (err, data) {
			if (!data[0]) {
				robinhood.accounts(credentials, socket);
				robinhood.positions(credentials, socket);
				robinhood.profile(credentials, socket);
				robinhood.orders(credentials, socket);
			}
			else {
				socket.emit('accounts', data[0]['account']);
				socket.emit('positions', data[0]['positions'].data);
				socket.emit('profile', data[0]['profile']);
				socket.emit('orders', data[0]['orders'].data);
				socket.emit('url', data[0]['portfolio']);
				if (data[0]['buylist']) {
					socket.emit('buylist', data[0]['buylist']);
				}
			}
		});*/
}
var verifyBank = function (data, socket) {

}
var verifyEmail = function (credentials, data, socket) {
	m.Account.findOne({ credentials });
}
var newLogin = function (credentials, data, socket) {
	m.Account.findOne({ credentials });
}
var accountForm = function (data, socket, clientIp) {
	//create pin
	//create account number
	//save to mongodb
	//send email
	var pin = Math.floor(Math.random() * (998888 - 102222) + 102222);
	pin = pin.toString();

	data.email_verified = false;
	data.emailPin = pin;
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
				mg.verifyEmail(data.email, pin);
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

	/*	m.Account.findByIdAndUpdate(
			{ email: data.email },
			{
				email: data.email,
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				emailPin: pin,
				email_verified: false,
				active: false,
				// ip_addresses: [Number],
			},
			{ upsert: true, new: true, runValidators: true }, function (err, result) {
				if (err) console.log("ERR", err);
				if (result) {
					console.log(result);
					mg.verifyEmail(data.email, pin);
				}
			});*/
}
var contactForm = function (credentials, data, socket) {
	m.Account.update(
		credentials,
		{ $setOnInsert: data },
		{ upsert: true },
		function (err, result) {
			if (err) console.log("ERR", err);
			if (result) {
				console.log(result);
				mg.verifyEmail(data.email, pin);
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
var fundingForm = function (credentials, data, socket) {

}
var achDeposit = function (credentials, data, socket) {

}
var achWithdrawal = function (credentials, data, socket) {

}


/*
var accountData = function (credentials, socket) {
	m.Account.find(credentials, function (err, data) {
		if (!data[0]) {
			robinhood.accounts(credentials, socket);
			robinhood.positions(credentials, socket);
			robinhood.profile(credentials, socket);
			robinhood.orders(credentials, socket);
		}
		else {
			socket.emit('accounts', data[0]['account']);
			socket.emit('positions', data[0]['positions'].data);
			socket.emit('profile', data[0]['profile']);
			socket.emit('orders', data[0]['orders'].data);
			socket.emit('url', data[0]['portfolio']);
			if (data[0]['buylist']) {
				socket.emit('buylist', data[0]['buylist']);
			}
		}
	});
};
var addToBuylist = function (credentials, socket, symbol, price, quantity) {
	m.Account.findByIdAndUpdate(
		credentials,
		{ $push: { "buylist": { symbol: symbol, price: price, quantity: quantity } } },
		{ safe: true, upsert: true },
		function (err, result) {
			console.log(err);
			socket.emit('confirmation', result);
		}
	);
}
var quotes = function (credentials, socket) {
	m.Stock.find({ tradable: true }, function (err, stocks) {
		stocks.forEach(function (s) {
			if (s.quote && s.quote.last_trade_price) {
				socket.emit('quote', s.quote);
			} else {
				robinhood.quote(credentials, socket, s.symbol);
			}
		});
	});
}
var quote = function (credentials, socket, symbol) {
	m.Stock.findOne({ symbol: symbol }, function (err, data) {
		if (data[0].quote && data[0].quote.last_trade_price) {
			console.log("MDB Quote", data[0].quote);
			socket.emit('quote', data[0].quote);
		} else {
			console.log("RB Quote", symbol);
			robinhood.quote(credentials, socket, symbol);
		}
	});
}
var divCollection = {};
m.Stock.find({ tradable: true }, function (err, stock) {
	if (err) return console.error(err);
	if (stock) {
		//divCollection = stock;
		stock.forEach(function (x) {
			divCollection[x.symbol] = x.dividends.nextDividend;
		});
	}
});
var divDatabase = function (credentials, socket) {
	let date = new Date();
	m.Stock.find({ tradable: true }, function (err, stock) {
		if (err) return console.error(err);
		if (stock) {
			//divCollection = stock;
			stock.forEach(function (x) {
				divCollection[x.symbol] = x.dividends.nextDividend;
				if (stock.quote && mostCurrent(stock.quote.updated_at)) {
					quote(credentials, socket, x.symbol);
				}
			});
			if (socket)
				socket.emit('divDatabase', divCollection);
			// console.log('stocks', divCollection);
		}
	});
}
var mostCurrent = function (date) {
	const now = new Date();
	date = new Date(date);
	if (now.getUTCDate() !== date.getUTCDate()) {
		return false;
	}
	if (now.getUTCHours() > 20 && now.getUTCHours() < 14) {
		return false;
	}
	return true;
}*/
module.exports = {
	auth: auth,
	accountData: accountData,
	verifyBank: verifyBank,
	verifyEmail: verifyEmail,
	newLogin: newLogin,
	accountForm: accountForm,
	contactForm: contactForm,
	fundingForm: fundingForm,
	achDeposit: achDeposit,
	achWithdrawal: achWithdrawal
}
// accountData({ username: 'jeaber', password: '01k^ejpbF0l5' }, null);