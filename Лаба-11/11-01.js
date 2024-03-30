const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { BasicStrategy, DigestStrategy } = require('passport-http');
const allowedCredentials = require('./credentials.json');

const app = express();
const auth = 'digest';

app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, next) => {
    next(null, user);
});
  
passport.deserializeUser((user, next) => {
   if (user) {
       next(null, user);
   } else {
       next(new Error('User not found'));
   }
});

// passport.use(new BasicStrategy((username, password, done) => {
//   const user = allowedCredentials[username];
//   if (!user || user.password !== password) {
//     return done(null, false);
//   }
//   console.log('Success auth');
//   return done(null, user);
// }));

passport.use(new DigestStrategy({ qop: 'auth' },
    (username, done) => {
        const user = allowedCredentials[username];
        if (!user) {
           return done(null, false);
        }
           console.log('Success auth');
        return done(null, user, user.password);
    },
    (params, done) => {
        done(null, true);
    }
));

const checkL = (req, res, next) => {

  if (req.session.logout && req.headers.authorization) {
      delete req.headers.authorization;
      req.session.logout = false;
      req.logout(() => {});
  }
  next();
}

app.get('/login', (req, res, next) => {
    if (req.session.logout && req.headers.authorization) {
        delete req.headers.authorization;
        req.session.logout = false;
    }
    next();
}, passport.authenticate(auth, { session: false, successRedirect: '/resource' }));

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    res.redirect('/login');
});

app.get('/resource', passport.authenticate(auth, { session: false, failureRedirect: '/login' }),
 (req, res) => {
    res.send('RESOURCE');
});

app.use((req, res) => {
    res.status(404).send('Страница не найдена');
});

app.listen(3000, () => {
    console.log(`Сервер запущен на порту 3000`);
});