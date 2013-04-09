var WM = require('../modules/website-manager.js');

exports.getListOfWebsites = function(req,res) {
  console.log("Publisher attempt to get all his websites");
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
        WM.getWebsites(req.session.uid, null, null, function(e,o) {
          if(!o || e || o.length) {
            if(!e) {
              e = new Error('Unable to get the list of websites');
            }
            res.send(e, 400);
          }
          else {
            res.send(o, 200);
          }
        });
  }
};

exports.default = function(req, res) {
  if(req.session.kind != 'publisher') {
    res.redirect("/");
  } else {
    res.send(200, "OK");
  }
};

exports.deleteWebsite = function(req,res) {
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    WM.deleteWebsite(req.session.uid,req.param('id'),function(e,websiteWasDeleted){
      if(e || !websiteWasDeleted) {
        if(!e) {
          e = new Error('Unable to delete website');
        }
        res.send(e, 400);
      } else if(websiteWasDeleted) {
        res.send("OK", 200);
      }
    });
  }
};

exports.getWebsite = function(req, res){
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    WM.getWebsite(req.param('id'),function(e,fetchedWebsite){
      if(!fetchedWebsite || e) {
        if(!e) {
          e = new Error('Unable to get website');
        }
        res.send(e, 400);
      } else {
        res.send(fetchedWebsite, 200);
      }
    });
  }
};

exports.createWebsite = function(req,res) {
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    WM.addWebsite(req.session.uid,req.body,function(e,createdWebsite) {
      if(!createdWebsite || e) {
        if(!e) {
          e = new Error('Unable to create website');
        }
          res.send(e, 400);
      }
      else {
        res.send(createdWebsite, 200);
      }
    });
  }
};

exports.updateWebsite = function(req, res) {
  if(req.session.kind != "publisher") {
    res.redirect("/");
  } else {
    WM.updateWebsite(req.session.uid,req.body,function(e,updatedWebsite) {
      if(!updatedWebsite || e) {
        if(!e) {
          e = new Error('Unable to update website');
        }
          res.send(e, 400);
      }
      else {
        res.send(updatedWebsite, 200);
      }
    });
  }
};