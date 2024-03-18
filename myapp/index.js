const express = require('express');
const app = express();
const users = require('./db');

app.get('/', (req, res) => {
  res.format({
    html: () => {
      res.send('<ul>' + users.map((user) => {
        return '<li>' + user.name + '<li>';
      }).join('') + '<ul>');
    },

    text: () => {
      res.send(users.map((user) => {
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: () => {
      res.json(users);
    }
  });
});

function format(path) {
  let obj = require(path);
  return (req, res) => {
    res.format(obj);
  };
}

app.get('/users', format('./users'));

app.listen(3000, () => {
  console.log('Express started on port 3000!');
});
