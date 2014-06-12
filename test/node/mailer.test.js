var sinon = require('sinon');
var expect = require('chai').expect;

var req = {
  body: {
    timestamp: "2014-06-08T09:30:26.123"
  },
  sendGrid: require('sendgrid')(process.env.SENDGRID_API_USER, process.env.SENDGRID_API_KEY)
};

describe("Mailer", function() {

  it('should send mail', function() {

    sinon.stub(req.sendGrid, 'send', function(message) {
      expect(message.subject).to.equal('[SENTINEL] Alert in kitchen');
      expect(message.text).to.match(/^Zone kitchen was alerted \d+ days ago at Sun Jun 08 2014/);
    });

    var sendAlertEmail = require('../../lib/mailer').sendAlertEmail;

    sendAlertEmail(req, 'mark.wolfe@ninjablocks.com', {name: 'kitchen'});

    sinon.assert.calledOnce(req.sendGrid.send); // sinon assertion

  });

});