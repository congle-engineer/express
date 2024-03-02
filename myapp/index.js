const express = require('express');
const hash = require('pbkdf2-password')();
const path = require('path');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhhh'
}));

app.use((req, res, next) => {
  const err = req.session.error;
  const msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) {
    res.locals.message = `<p class='msg error'>${err}</p>`;
  }
  if (msg) {
    res.locals.message = `<p class='msg success'>${msg}</p>`;
  }
  next();
});

const users = {
  tj: { name: 'tj' }
};

hash({ password: 'foobar' }, (err, pass, salt, hash) => {
  if (err) {
    throw err;
  }
  users.tj.salt = salt;
  users.tj.hash = hash;
});

function authenticate(name, pass, fn) {
  if (!module.parent) {
    console.log(`authenticating: ${name}:${pass}`);
  }
  const user = users[name];
  if (!user) {
    return fn(null, null);
  }
  hash({ password: pass, salt: user.salt }, (err, pass, salt, hash) => {
    if (err) {
      return fn(err);
    }
    if (hash == user.hash) {
      return fn(null, user);
    }
    fn(null, null);
  });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/restricted', restrict, (req, res) => {
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res, next) => {
  authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.session.regenerate(() => {
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authenticated failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
