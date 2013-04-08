  var routes = require('./routes')
  , signup = require('./routes/signup')
  , publisher = require('./routes/publisher')
  , websites = require('./routes/websites')
  , zones = require('./routes/zones')
  , advertiser = require('./routes/advertiser')
  , delivery = require('./routes/delivery');

module.exports = function(app) {

	app.get('/', routes.index);
	app.get('/logout', routes.logout);

	app.post('/signup', signup.create); 
	app.get('/signup/step2', signup.step2); // Signup step2

	app.get('/publisher', publisher.index);
	app.get('/publisher/get', publisher.get);
	app.post('/publisher/changePassword' ,publisher.changePassword);
	app.get('/publisher/getProfile', publisher.getProfile);
	app.post('/publisher/signin', publisher.signin);

	app.get('/publisher/profile', publisher.profile);
	app.post('/publisher/profile', publisher.updateProfile);

	app.get('/publisher/security', publisher.getActions);

	app.get('/publisher/default', publisher.default);
	app.get('/publisher/websites', publisher.getWebsites);
	app.get('/publisher/websites/default', websites.default);
	app.get('/publisher/websites/:id', publisher.getWebsite);
	app.get('/publisher/websites/:id/delete', publisher.deleteWebsite); // 
	app.post('/publisher/websites', publisher.createWebsite);

	app.get('/publisher/zones/default', zones.default);
	app.post('/publisher/zones', publisher.createZone);


	app.get('/advertiser', advertiser.index);
	//app.get('/advertiser/get', advertiser.get); TODO
	app.post('/advertiser/signin', advertiser.signin);

	app.get('/advertiser/profile', advertiser.profile);
	app.post('/advertiser/profile', advertiser.updateProfile);

	app.get('/advertiser/default', advertiser.default);
	//app.get('/advertiser/ads', advertiser.getAds); // TO DO
	app.post('/advertiser/ads', advertiser.createAd);


	//app.get('/socket', routes.socket);
//	app.get('/socketview', routes.socketview);

	app.get('/test', publisher.test);
	app.get('/h/c/:r', delivery.createHash);
	app.get('/h/:r', delivery.test);


	app.get('/ad/:account/:website/:randomNumber/init.js', delivery.generateJS);

	app.get('*', routes.pagenotfound);

}