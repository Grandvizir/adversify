var mongoose = require('mongoose');
var pwd = require('pwd');
/*
 * Signup
 */
/* Route create on POST request */

exports.create = function(req, res){
    console.log(req.body); 
    var user;
    var query;
    var stop = false;
    if(req.body.kind === 0 || req.body.kind === 1){
      pwd.hash(req.body.password, function(err, salt, hash){
        if(req.body.kind === 0){
          query = PublisherModel.find(null);
          query.where('username',req.body.username);
          query.exec(function (err, publishers) {
            if (err) { throw err; }
            if(publishers.length === 0) { // Vas-y je mets mon commentaire là !
              user.save(function (err) {
                if (!err) {
                  return console.log("Successfuly created USER");
                } else {
                  return console.log(err);
                  /* res.render('index.html', { title: 'SIGNUP ERROR' });*/
                }
                return res.send(user);
              });
            }
            else
            {
              console.log('username already in use!');
            }
          });
          user = new AdvertiserModel({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            salt: salt
          });
          console.log("Creating Advertiser");
        }
        if(req.body.kind === 1){
          query = AdvertiserModel.find(null);
          query.where('username',req.body.username);
          query.exec(function (err, advertisers) {
            if (err) { throw err; }
            if(advertisers.length === 0) {
              user.save(function (err) {
                if (!err) {
                  return console.log("Successfuly created USER");
                } else {
                  return console.log(err);
                  /* res.render('index.html', { title: 'SIGNUP ERROR' });*/
                }
                return res.send(user);
              });
            }
            else
            {
              console.log('username already in use!');
            }
          });
          user = new PublisherModel({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            salt: salt
          });
          console.log("Creating Publisher");
        }
    });
  }
};
