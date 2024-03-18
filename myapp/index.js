const express = require('express');
const path = require('path');

const app = express();

const FILES_DIR = path.join(__dirname, 'files');

console.log(FILES_DIR)

app.get('/', (req, res) => {
  res.send('<ul>' + 
    '<li>Download <a href="/files/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
    '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>' + 
    '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>' +
    '<ul>');
});

app.get('/files/:file(*)', (req, res, next) => {
  res.download(req.params.file, { root: FILES_DIR }, (err) => {
    if (!err) {
      return;
    }
    if (err.status !== 404) {
      return next(err);
    }
    res.statusCode = 404;
    res.send('Cannot find that file, sorry!');
  })
});

app.listen(3000, () => {
  console.log('Express started listening on port 3000!');
});
