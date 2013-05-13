var mongoose = require('mongoose'),
pwd = require('pwd'),
AM = {};

module.exports = AM;

AM.loginAdvertiser = function(u, password, callback) {
		AdvertiserModel.findOne({username:u}, function(e, o) {
		if (o === null){
			callback('advertiser-not-found');
		}	else{
			pwd.hash(password, o.salt, function(err, hash){
				if (o.password == hash) {
					callback(null,o);
					console.log("User Successfully logged in to Advertiser account ("+u+")");
				} else {
					callback('invalid-password');
				}
			});
		}
	});
};


AM.autoLoginAdvertiser = function(username, password, callback) {
	AdvertiserModel.findOne({username:username}, function(e, o) {
		if (o){
			o.password == password ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
};


AM.autoLoginPublisher = function(username, password, callback)
{
	PublisherModel.findOne({username:username}, function(e, o) {
		if (o){
			o.password == password ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
};



AM.loginPublisher = function(username, password, callback) {
	console.log(password);
		PublisherModel.findOne({username:username}, function(e, o) {
		if (o == null){
			callback('publisher-not-found');
		}	else{
			pwd.hash(password, o.salt, function(err, hash){
  				if (o.password == hash) {
  					callback(null,o);
  				} else {
  					console.log("Invalid callback");
  					callback('invalid-password', null);
  				}
			});
		}
	});
};



AM.signupStep2 = function(newData, callback) {
	var user;
	// TO DO
};



AM.signup = function(newData, callback) {
	var user;
	// TO DO : Make a better query please!
	// Rassembler en une fonction isTaken(username,email,callback);
	AdvertiserModel.findOne({username:newData.username}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
				PublisherModel.findOne({username:newData.username}, function(e,o) {
					if (o){
						callback('username-taken'); // Username taken by publisher
					}	else{
							AdvertiserModel.findOne({email:newData.email}, function(e, o) {
								if (o){
									callback('email-taken'); // Username taken by advertiser
								}	else{
										PublisherModel.findOne({email:newData.email}, function(e, o) {
											if (o) {
												callback('email-taken'); // Email taken by publisher
											} 	else {
													pwd.hash(newData.password, function(e,salt,hash){ // TO;DO ; voir apply sur modele commun
														var user = ""
														, userJSON = {
															username: newData.username,
												            email: newData.email,
												        	password: hash,
												            salt: salt,
												        	joined: Date.now()
														};
														if(newData.kind === 0) {
															user = new AdvertiserModel(userJSON);
														} else if(newData.kind === 1) {
															user = new PublisherModel(userJSON);
														} else {
															callback("no-user-kind-specified");
														}

														if(userJSON && userJSON.salt) {
															user.save(function(e,o) {
																if(o) {
																	callback(null,o);
																} else {
																	callback(e);
																}
															});
														}
													});
												 }
										});
												}
										});
									}
							});
						}
				});

};

// TO DO AM.checkPassword();
AM.setPassword = function(u, oldPass, newPass, callback)
{
	AdvertiserModel.findOne({username:u}, function(e, o){
		if(o) {
			pwd.hash(newPass, function(e,salt,hash){
				o.pass = hash;
				o.salt = salt;
				AdvertiserModel.save(o); callback(o);
			});
		}
		else {
			PublisherModel.findOne({username:u}, function(e,o){
				if(o) {
					pwd.hash(newPass, function(e,salt,hash){
						o.pass = hash;
						o.salt = salt;
						PublisherModel.save(o); callback(o);
					});
				}
			});
		}
	});
};

AM.validateLink = function(email, passHash, callback) {
	AdvertiserModel.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		if(!o) {
			PublisherModel.find({ $and: [{email:email, pass:passHash}] }, function(e,o) {
				callback(o ? 'ok' : null);
			});
		}
	});
};

AM.updateAdvertiser = function(newData, callback) {
  var a = new AdvertiserModel({
    "email":newData.email,
    "city":newData.city,
    "street-adress":newData.streetadress,
    "phone":newData.phone,
    "country":newData.country
  });
  AdvertiserModel.findOneAndUpdate(
    { username : newData.username },
    { $set : a },
    { safe: true, upsert: true },
      function(e, o) {
            if(e) {
              callback(e);
            } else {
              callback(null,o);
            }
    });
};

AM.updatePublisher = function(u,newData, callback) {
  PublisherModel.findOneAndUpdate(
    { username : u },
    { $set:
		{
			email : newData.email,
            phone : newData.phone,
            streetadress : newData.streetadress,
            country : newData.country,
            city : newData.city
		}
	},
    { safe: true, upsert: true },
    function(e, o) {
		if(e) {
			callback(e);
		} else {
			callback(null,o);
		}
    });
};


AM.getPublisher = function(uId, callback) {
	PublisherModel.findById(uId, function(e,publisher) {
		if(e || !publisher) {
			callback(e);
		} else {
			callback(null, publisher);
		}
	});
};

AM.getPublisherProfile = function(u, callback) {
	PublisherModel.findOne({username:u}, function(e,o) {
		console.log(o);
		if(!e) {
			var user = {
				username: o.username,
				email: o.email,
				joined: o.joined,
				updated: o.updated,
				city: o.city,
				streetadress : o.streetadress,
				phone : o.phone,
				country : o.country
			};
			callback(null,user);
		} else {
			callback(e);
		}
	});
};


AM.getAdvertiser = function(u, callback) {
	AdvertiserModel.findOne({username:u}, function(e,o) {
		if(!e) {
			callback(null,o);
		} else {
			callback(e);
		}
	});
};