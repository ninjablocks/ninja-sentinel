var ninjaBlocks = require('ninja-blocks')
  , request = require('request');

exports.handleNinjaAuthentication = function(req,res,ninja) {

  req.session.ninja = ninja.data;
  req.session.token = ninja.token;
  res.redirect('/');
};

exports.proxy = function(req,res) {

  // Extend the request's query string with the access token
  var query = req.query;
  query.access_token = req.session.token;
  // Make the request
  request({
      url:'https://api.ninja.is'+req.url,
      qs: query,
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