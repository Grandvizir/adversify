var PM = require('../modules/publisher-manager.js');
var WM = require('../modules/website-manager.js');
var ZM = require('../modules/zone-manager.js');

exports.index = function(req, res){
  if(req.cookies.username == undefined || req.cookies.password == undefined){
    res.render('login-publisher.html', { title: 'Login to your Publisher account.' });
  } else {
    PM.autoLogin(req.cookies.username, req.cookies.password, function(o){
      if (o !== null){
        req.session.username = o.username;
        req.session.uid = o._id;
        req.session.kind = "publisher";
        res.redirect('/publisher/default');
      } else{
        res.render('login-publisher.html', { title: 'Login to your Publisher account.' });
      }
    });
  }
};

exports.signin = function(req, res){
  console.log(req.body);
  PM.login(req.param('username'),req.param('password'), function(e,o) {
      if (e || !o){
        if(!o) {
          e = new Error('Could not retrieve your account.');
        }
        res.send(e, 400);
      } else{
        req.session.user = {name: req.params.username, password: req.params.password, kind: 'publisher'};
        if (req.param('remember-me') == 'on'){
          res.cookie('username', o.username, { maxAge: 900000 });
          res.cookie('password', o.password, { maxAge: 900000 });
        }
        res.redirect("/publisher");
      }
  });
};

exports.default = function(req,res) {
  var since;
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    console.log(req.session.uid);
          res.render('publisher-default.html', {
            title: "Ad{versify}",
                locals: {
                  uid: req.session.uid
                }
          });
  }
};



exports.createZone = function(req,res) {
  console.log("Publisher attempt to create Zone for website : "+req.body.url);
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
        ZM.addZone(req.session.username,req.body,function(e,o) {
      if(!o) {
          res.send(e, 400);
      }
      else {
        res.send(o, 200);
      }
    });
  }
};



exports.profile = function(req,res) {
    if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    res.render('publisher-profile.html', { title: 'Publisher Profile'});
  }
};

exports.updateProfile = function(req,res) {
    if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
        PM.updateAccount(req.session.username,req.body,function(e,o) {
          if(!o) {
              res.send(e, 400);
          }
          else {
            res.send(o, 200);
          }
        });
  }
};

exports.get = function(req,res) {
    if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    PM.get(req.session.username, function(e,o) {
      if(!o) {
          res.send(e,400);
      } else  {
          res.send(o,200);
      }
    });
  }
};

exports.getProfile = function(req,res) {
    if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    PM.getProfile(req.session.username, function(e,o) {
      if(!o) {
          res.send(e,400);
      } else  {
          res.send(o,200);
      }
    });
  }
};

exports.getActions = function(req,res) {
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    ActionModel.find({userId:req.session.uid},function(e,o) {
      if(e) { res.send(e,400); }
      if (o) {    
        res.render('security-history.html', {
          title: "Security History",
            locals: {
              actions: o
            }
        }); 
      }
    });
  }
};


exports.test = function(req,res) {
  WebsiteModel.findOne(null,function(e,o) {
    res.send(o.zones);
  });
};


exports.changePassword = function(req,res) {
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    PM.checkPassword(req.body.u,req.body.password,function(e) {
      if(!e) {
        PM.setPassword(req.session.username,req.body.password, function(e,o) {
          if(!o) {
              res.send(e,400);
          } else  {
              res.send(o,200);
          }
      });
      } else {
        res.send(e,400);
      }

    });
  }
};