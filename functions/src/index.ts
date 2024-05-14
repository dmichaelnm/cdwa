import { onRequest } from 'firebase-functions/v2/https';

exports.test = onRequest(
  { region: 'europe-west3', cors: true },
  (request, response) => {
    response.send('Hello World!');
  }
);
