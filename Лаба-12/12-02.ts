import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { Sequelize, Model, DataTypes } from 'sequelize';
import Redis from 'ioredis';
import cookieParser from 'cookie-parser';

interface RequestWithUserId extends Request {
    username?: string;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/db.sqlite'
});

// Определение модели пользователей
class User extends Model {}
User.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: 'user',
    timestamps: false,
    createdAt: false,
    updatedAt: false }
);

// sequelize.sync({ force: true }).then(() => {
//     console.log('Таблица пользователей была создана');
//   }).catch((error) => {
//     console.log('Ошибка при создании таблицы пользователей:', error);
//   });

const redis = new Redis({
  host: 'localhost',
  port: 6379
 });

const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, 'access-secret', { expiresIn: '10m' });
};

const generateRefreshToken = (username: string) => {
  return jwt.sign({ username }, 'refresh-secret', { expiresIn: '24h' });
};

const isAuthenticated = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).send('Неаутентифицированный доступ');
  }

  jwt.verify(refreshToken, 'refresh-secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send('Неаутентифицированный доступ');
    }

    let blacklist: String[] = [];

    redis.smembers('blacklist').then(val => {
      blacklist = val;
      console.log(val);
      console.log(refreshToken);
      console.log(blacklist.includes(refreshToken));

      if (blacklist.includes(refreshToken)) {
        return res.status(401).send('Неаутентифицированный доступ');
      }

      jwt.verify(accessToken, 'access-secret', (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send('Неаутентифицированный доступ');
        }

        req.username = decoded.username;
        next();
      });
    });
  });
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

app.post('/login', async (req, res) => {    
  const { username, password } = req.body;

  const user : any = await User.findOne({ where: { username, password } });

  if (user) {
    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict'});

    res.redirect('/resource');
  } else {
    res.redirect('/login');
  }
});

app.get('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send('Неаутентифицированный доступ');
  }

  jwt.verify(refreshToken, 'refresh-secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send('Неаутентифицированный доступ');
    }

    const username = decoded.username;
    const newAccessToken = generateAccessToken(username);
    const newRefreshToken = generateRefreshToken(username);

    redis.sadd('blacklist', refreshToken);

    res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict' });

    res.redirect('/resource');
  });
});

app.get('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(redis.smembers('blacklist').then((d) => console.log(d)));
  
  if (refreshToken) {
    redis.sadd('blacklist', refreshToken, (err, reply) => {
      if (err) {
        console.error('Ошибка при добавлении токена в черный список:', err);
        res.status(500).send('Ошибка сервера');
      } else {
        console.log('Токен успешно добавлен в черный список:', refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.send('Выход из системы успешно выполнен');
      }
    });
    
  }
});

app.get('/register', (req, res) => {
  res.send(`
     <h1>Форма регистрации</h1>
     <form action="/register" method="POST">
       <input type="text" name="username" placeholder="Имя пользователя" required /><br/>
       <input type="password" name="password" placeholder="Пароль" required /><br/>
       <button type="submit">Зарегистрироваться</button>
     </form>
  `);
 });

 app.post('/register', async (req, res, next) => {
  try {
     const { username, password } = req.body;
     const user = await User.create({
       username, password,
     });
     res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
  } catch (error) {
     next(error);
  }
 });

app.get('/resource', isAuthenticated, (req : RequestWithUserId, res) => {
  res.send(`RESOURCE: Пользователь с ID ${req.username}`);
});

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(3000, () => {
  console.log(`Сервер запущен на порту 3000`);
});