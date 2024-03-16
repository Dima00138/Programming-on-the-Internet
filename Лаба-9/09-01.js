const express = require('express');
const { Sequelize, Op } = require('sequelize');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'images/' })
const db = require('./db');
app.use(express.json());
app.use('/images/', express.static('images'));
app.use('/images/*', (req, res) => {
  res.status(404).json({ error: 'File not found' });
});

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname+'/db.sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 100000
  }
});

// Services
const pizzaService = require('./services/pizzaservice');
const turtleService = require('./services/turtleservice');
const weaponService = require('./services/weaponservice');

//routes
const turtleRoute = require('./routes/turtles');
const PizzaRoute = require('./routes/pizzas');
const WeaponRoute = require('./routes/weapons');

app.use('/api', turtleRoute);
app.use('/api', PizzaRoute);
app.use('/api', WeaponRoute);

//4
app.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'turtles.html'));
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: '404'});
  }
});

//5
app.get('/upload', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: '404'});
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
  let turtleId = req.body.turtleId;
  let turtle = await db.Turtle.findByPk(turtleId);
  if (!turtle) {
    return res.status(404).send('Turtle not found');
  }

  let imagePath = path.join('images', `turtle_${turtleId}.jpg`);

  fs.rename(req.file.path, imagePath, err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Save error');
    }

    turtle.image = __dirname + imagePath;
    turtle.save();
    res.send('Complete');
  });
});

// Start server
db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});