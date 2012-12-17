/**
 * Application configuration.
 */

var requiredEnv = [
  'NINJA_CLIENT_ID','NINJA_CLIENT_SECRET', 'HOSTNAME',
  'TWILIO_SID', 'TWILIO_TOKEN',  'TWILIO_PHONE',
  'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_DOMAIN', 'EMAIL_USER', 'EMAIL_PASS'
], neededEnv = [];

for (var i=0;i<requiredEnv.length;i++)
  if (!process.env[requiredEnv[i]])
    neededEnv.push(requiredEnv[i]);

if (neededEnv.length>0)
  throw new Error("Environment variables "+neededEnv.join(',')+" required");


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index')
  , zoneRoutes = require('./routes/zone')
  , alertRoutes = require('./routes/alert')
  , http = require('http')
  , path = require('path')
  , redisClient = require('redis-url').connect(process.env.REDISTOGO_URL)
  , RedisStore = require('connect-redis')(express)
  , mailer = require('nodemailer');

var app = express();
var authom = require('authom');

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.cookieParser())
  app.use(express.session({secret:"ninjaALLTHETHINGS",store: new RedisStore({client:redisClient})}));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req,res,next) {
    res.setHeader( 'X-Powered-By', "A bad-ass mother who don't take no crap off of nobody!" );
    req.app = app;
    req.redisClient = redisClient;
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * Middleware
 */

var requiresAuthentication = function(req,res,next) {
  if (!req.session || !req.session.token || !req.session.ninja) {
    if (req.accepts('html')) {
      res.redirect('/auth/ninjablocks');
    } else {
      res.json({error:'Unauthorized'},401)
    }
    return;
  }
  next();
}

var TwilioClient = require('twilio').Client
, twilioClient = new TwilioClient(process.env.TWILIO_SID, process.env.TWILIO_TOKEN, process.env.HOSTNAME, {express: app})
, phone = twilioClient.getPhoneNumber(process.env.TWILIO_PHONE);

var setupTransports = function(req,res,next) {
  var transport = mailer.createTransport("SMTP", {
      host : process.env.EMAIL_HOST,
      port : process.env.EMAIL_PORT,
      domain : process.env.EMAIL_DOMAIN,
      secureConnection: true,
      auth: {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS

      }
  });
  req.mailer = transport;
  phone.setup(function() {
    req.phone = phone;
    next();
  });
}

/**
 * Authom configuration
 */

authom.createServer({
  service:"ninjablocks",
  id:process.env.NINJA_CLIENT_ID,
  secret:process.env.NINJA_CLIENT_SECRET,
  scope:['all']
});

authom.on('auth', routes.handleNinjaAuthentication);

authom.on('error',function(req,res,data) {
  res.send('There was an error authenticating')
});

app.get('/auth/:service', authom.app);

/**
 * Proxy all /rest/v0 routes to Ninja Cloud
 */

app.all('/rest/v0/*', requiresAuthentication, routes.proxy);

/**
 * App Routes
 */

app.get('/', requiresAuthentication, routes.index);
app.post('/callback', setupTransports, routes.handleDeviceCallback);

app.get('/history', requiresAuthentication, routes.fetchHistory);

app.put('/override', requiresAuthentication, routes.setGlobalOverride);
app.delete('/override', requiresAuthentication, routes.removeGlobalOverride);
app.get('/override', requiresAuthentication, routes.getGlobalOverride);

app.get('/alert', requiresAuthentication, alertRoutes.fetchAllAlerts);
app.post('/alert', requiresAuthentication, alertRoutes.createAlert);
app.get('/alert/:alertId', requiresAuthentication, alertRoutes.fetchAlert);
app.put('/alert/:alertId', requiresAuthentication, alertRoutes.updateAlert);
app.delete('/alert/:alertId', requiresAuthentication, alertRoutes.deleteAlert);

app.get('/zone', requiresAuthentication, zoneRoutes.fetchAllZones)
app.post('/zone', requiresAuthentication, zoneRoutes.createZone);
app.put('/zone/:zoneId', requiresAuthentication, zoneRoutes.updateZone);
app.get('/zone/:zoneId', requiresAuthentication, zoneRoutes.fetchZone);
app.delete('/zone/:zoneId', requiresAuthentication, zoneRoutes.deleteZone);

app.put('/zone/:zoneId/trigger', requiresAuthentication, zoneRoutes.registerTrigger);
app.delete('/zone/:zoneId/trigger/:triggerData', requiresAuthentication, zoneRoutes.deleteTrigger);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Ninja listening on port " + app.get('port'));
});