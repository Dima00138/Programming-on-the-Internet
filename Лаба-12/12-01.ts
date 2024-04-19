import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

const app = express();

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const users = require('./credentials.json');

passport.use(new Strategy((username, password, done) => {
  const user = users.find((user: any) => user.username == username && user.password == password);
  if (user) {
    return done(null, user);
  } else {
    
    return done(null, false, { message: 'Неверные учетные данные' });
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.username);
});

passport.deserializeUser((username: string, done) => {
  const user = users.find((user: any) => user.username === username);
  done(null, user);
});

const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Неаутентифицированный доступ');
};

app.get('/login', (req, res) => {    
  res.send(`
    <h1>Форма входа</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Имя пользователя" required /><br/>
      <input type="password" name="password" placeholder="Пароль" required /><br/>
      <button type="submit">Войти</button>
    </form>
  `);
});

app.post('/login', passport.authenticate('local',
{
    successRedirect: '/resource',
    failureRedirect: '/login'
  }));

app.get('/logout', (req, res) => {
  req.logout((err) => console.log(err));
  res.redirect('/login');
});

app.get('/resource', isAuthenticated, (req, res) => {
    console.log(req.user);
    res.send(`Доступ к ресурсу<br/>Пользователь: ${JSON.stringify(req.user)}`);
});

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(3000, () => {
  console.log(`Сервер запущен на порту 3000`);
});