var api_key = process.env.mgkey;//'key-XXXXXXXXXXXXXXXXXXXXXXX';
var domain = process.env.mgdomain; //'www.mydomain.com';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
var mailcomposer = require('mailcomposer');



var payout = function (email, amount) {
	var mail = mailcomposer({
		from: 'Upcrue <donotreply@upcrue.com>',
		to: email,
		subject: 'Monthly cash payout',
		text: 'Test email text',
		html: 'We have added ' + amount + ' to your interest to your balance. It will continue to compound monthly. No action is required. Thank you for being a member of Upcrue.'
	});
	mail.build(function (mailBuildError, message) {

		var dataToSend = {
			to: email,
			message: message.toString('ascii')
		};

		mailgun.messages().sendMime(dataToSend, function (sendError, body) {
			// console.log(body);
			if (sendError) {
				console.log(sendError);
				return;
			}
		});
	});
}
module.exports = {
	payout: payout, // {email,pin}
}