# Ninja Sentinel Security Web Application

This application was developed by [Ninja Blocks Inc](http://ninjablocks.com) to provide a working example of how to extend the platform it is
designed to be hosted in [Heroku](http://heroku.com) but has no specific dependency on it.

# Dependencies

To spin up this service yourself you will require:

* Email account, at the moment this is designed to use [sendgrid](http://sendgrid.com).
* [Heroku](http://heroku.com) account
* [Loggly](http://loggly.com) addon for heroku
* [REDIS](http://redis.io) addon for heroku, we use [redistogo](http://redistogo.com/)
* [Tempodb](https://tempo-db.com/) account
* [Twilio](https://www.twilio.com/) account
* Ninja Blocks client id and secret

# Configuration

Below are the environment variables we configure to provision the service, these will need to be set via the heroku command (see `heroku help config`).

```
# Sendgrid configuration
EMAIL_DOMAIN:        somedomain.com
EMAIL_FROM:          noreply@somedomain.com
EMAIL_USER:          noreply@somedomain.com
SENDGRID_API_USER:   whatever@somedomain.com
SENDGRID_API_KEY:    XXX

# Available from Ninja Blocks portal
NINJA_CLIENT_ID:     XXX
NINJA_CLIENT_SECRET: XXX

# Signup for tempodb
TEMPODB_API_HOST:    api.tempo-db.com
TEMPODB_API_KEY:     XXX
TEMPODB_API_PORT:    443
TEMPODB_API_SECRET:  XXX
TEMPODB_API_SECURE:  True

# Signup for twillio
TEST_CALL_NUMBER:    XX
TWILIO_PHONE:        XX
TWILIO_SID:          XX
TWILIO_TOKEN:        XX
```

## License
Copyright (c) 2014 Ninja Blocks Inc released under the MIT license.
