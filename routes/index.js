var ninjaBlocks = require('ninja-blocks')
  , request = require('request');

exports.handleNinjaAuthentication = function(req,res,ninja) {

  req.session.ninja = ninja.data;
  req.session.token = ninja.token;
  res.redirect('/');
};

exports.proxy = function(req,res) {

  request({
      url:'https://api.ninja.is'+req.url,
      qs: { access_token:req.session.token },
      json:true
  }).pipe(res);
};

exports.index = function(req, res){

  var ninja = ninjaBlocks.app({access_token:req.session.token});
  ninja.devices(function(err,devices) {

    res.render('index.jade',{
      title:'Node Ninja App Stub',
      ninja:req.session.ninja,
      devices:devices
    });
  });
};