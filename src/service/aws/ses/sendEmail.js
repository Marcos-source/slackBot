require('dotenv').config();
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');

let ses;


// params includes emailType with their respective attribute values
// info includes what params expects
const sendEmail = ({ params, info }) => {
  // TODO: replace with something better
  // this should not even be configured outside of production
  if (process.env.NODE_ENV === 'production') {
    aws.config.loadFromPath('./aws_config.json');
    ses = new aws.SES();
  }

  const {
    subject, type, attributes, bodyText,
  } = params;
  const {
    AWS_SOURCE_EMAIL_ADDRESS,
    AWS_DESTINATION_EMAIL_ADDRESS,
  } = process.env;
  const charset = 'UTF-8';

  const bodyHtml = fs.readFileSync(path.resolve(__dirname, `./templates/${type}.html`), { encoding: 'utf8' });
  const parameters = {};
  attributes.forEach((attribute) => {
    parameters[`_${attribute}`] = info[attribute];
  });
  const htmlRegExp = new RegExp(Object.keys(parameters).join('|'), 'gi');

  // eslint-disable-next-line max-len
  const replaceText = (htmlText, htmlParameters) => htmlText.replace(htmlRegExp, (matched) => htmlParameters[matched]);


  const emailParams = {
    Source: AWS_SOURCE_EMAIL_ADDRESS,
    Destination: {
      ToAddresses: [
        AWS_DESTINATION_EMAIL_ADDRESS,
      ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset,
      },
      Body: {
        Text: {
          Data: replaceText(bodyText, parameters),
          Charset: charset,
        },
        Html: {
          Data: replaceText(bodyHtml, parameters),
          Charset: charset,
        },
      },
    },
  };
  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      console.log(err.message);
    } else { // Added log by logmessage parameter
      console.log(`${type} Email sent! Message ID: `, data.MessageId);
    }
  });
};
module.exports = { sendEmail };
