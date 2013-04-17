var mongoose = require('mongoose'),
ZM = require('../modules/zone-manager.js'),
WM = {};

module.exports = WM; // WEBSITE MANAGER MODULE

/*
 * Retrieve publishers websites list
 * @function
 * @param {String} uId userId from session
 * @param {String} nb number of results to fetch
 * @param {String} sort criteria, 'ascending' or 'descending'
 * @param {Function} callback(err, result) function that is used to give back results or error
*/


WM.getListOfWebsites = function(uId,nb,sort,callback) {
	var websiteIds = [];
	console.log('@ website-manager');
	WebsiteModel.find({owner: uId}, function(err, fetchedWebsites) {
		if(err || !fetchedWebsites) {
			if(!err) {
				err = new Error('Unable to retrieve your websites');
			}
			console.log('halala');
			callback(err);
		} else {
			console.log('izi');
			callback(null,fetchedWebsites);
		}
	});
};

/*
 * Update a single website
 * @function
 * @param {String} uId userId from session
 * @param {String} websiteId _id of the targeted website
 * @param [{String}] newData website data to be updated via POST or PUT request 
 * @param {Function} callback(err,result) function that is used to give back results or error
*/

WM.updateWebsite = function(uId, websiteId, newData, callback) {
	WebsiteModel.findOneAndUpdate({_id : websiteId, owner: uId},{update : update}, function(err, websiteToUpdate) {
		if(err || !websiteToUpdate) {
			if(!err) {
				err = new Error('Unable to update this website');
			}
		} else {
			callback(null,websitoToUpdate);
		}
	});
};

/*
 * Retrieve single website
 * @function
 * @param {String} uId userId from session
 * @param {String} wId websiteId of the website
 * @param {Function} callback function that is used to give back results
*/

WM.getWebsite = function(uId, wId, callback) {
	WebsiteModel.findOne({owner: uId, _id: wId}, function(err, fetchedWebsite) {
		if(err || !fetchedWebsite) {
			if(!err) {
				err = fetchedWebsite;
			}
			callback(err);
		} else {
			callback(null, fetchedWebsite);
		}
	});
};


/*
 * Deletes single website, and the zones that are related to it
 * @function
 * @param {String} uId userId from session
 * @param {String} wId websiteId of the website
 * @param {Function} callback(err, result) function that is used to give back results
*/

WM.deleteWebsite = function(uId, wId, callback) {
	WebsiteModel.findOneAndRemove({_id : wId, owner: uId}, function(err, website) {
		if(err || !website) {
			callback(err ? err : 'Unable to find website');
		} else {
			callback(null,'OK');
		}
	});

};


/*
 * Create a website
 * @function
 * @param {String} uId userId from session
 * @param [{String}] newData : POST data to create a website
 * @param {Function} callback(err, result) function that is used to give back results
*/

WM.addWebsite = function(uId,newData,callback) {
	var newWebsite = new WebsiteModel({
		'infos' : {
			'name': newData.infos.name,
			'url':newData.infos.url
		},
		'zones': (newData.zones) ? newData.zones : '',
		'created':Date.now(),
		'owner': uId
	});
	newWebsite.save(function(err) {
		if(err) {
			console.log(err);
			callback((err.code !== 11000) ? err : 'website-already-exists');
		} else {
			callback(null, newWebsite);
		}
	});
};
//http://stackoverflow.com/questions/13412579/node-express-mongoose-sub-collection-document-insert?rq=1