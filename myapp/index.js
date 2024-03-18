const express = require('express');
const cookieSession = require('cookie-session');

const app = express();

app.use(cookieSession({ secret: 'congle' }));

app.get('/', (req, res) => {
  req.session.count = (req.session.count || 0) + 1;
  res.send('Viewed ' +  req.session.count + ' times\n');
});

app.listen(3000, () => {
  console.log('Express started on port 3000!');
});
