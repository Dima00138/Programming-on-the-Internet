const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/db.sqlite'
});

//code first
class Weapon extends Model { }

Weapon.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: DataTypes.STRING,
  dps: DataTypes.INTEGER
}, { sequelize, modelName: 'Weapon' });

class Pizza extends Model { }

Pizza.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: DataTypes.STRING,
  calories: DataTypes.DOUBLE
}, { sequelize, modelName: 'Pizza' });

class Turtle extends Model { } 

Turtle.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: DataTypes.STRING,
  color: DataTypes.STRING,
  weaponId: DataTypes.INTEGER,
  favoritePizzaId: DataTypes.INTEGER,
  secondFavoritePizzaId: DataTypes.INTEGER,
  image: DataTypes.STRING
}, { sequelize, modelName: 'Turtle' });


Turtle.belongsTo(Weapon, { as: 'weapon' });
Turtle.belongsTo(Pizza, { as: 'favoritePizza' });
Turtle.belongsTo(Pizza, { as: 'secondFavoritePizza' });

sequelize.sync({ force: true }).then(async () => {
  await Weapon.create({ id: 1, name: 'Sword', dps: 100 });
  await Weapon.create({ id: 2, name: 'Sword2', dps: 1020 });

  await Pizza.create({ id: 1, name: 'Margherita', calories: 250 });
  await Pizza.create({ id: 2, name: 'Bolognia', calories: 550 });
  await Pizza.create({ id: 3, name: 'Hawaiian', calories: 1550 });
  
  await Turtle.create({ id: 1, name: 'Leonardo', color: 'blue', weaponId: 1, favoritePizzaId: 1, secondFavoritePizzaId: 1, image: __dirname+'images/leonardo.png' });
  await Turtle.create({ id: 2, name: 'Rafael', color: 'red', weaponId: 2, favoritePizzaId: 2, secondFavoritePizzaId: 2, image: __dirname+'images/rafael.png' });
  await Turtle.create({ id: 3, name: 'Donatello', color: 'purple', weaponId: 2, favoritePizzaId: 2, secondFavoritePizzaId: 2, image: __dirname+'images/donatello.png' });
  await Turtle.create({ id: 4, name: 'Michelangelo', color: 'orange', weaponId: 1, favoritePizzaId: 3, secondFavoritePizzaId: 1, image: __dirname + 'images/michelangelo.png' });
  transact();
});

function transact() {
  sequelize.transaction(async (t) => {
    let pizzas = await Pizza.findAll({
      where: {
        calories: {
          [Sequelize.Op.gt]: 1500
        }
      },
      transaction: t
    });

    for (let pizza of pizzas) {
      pizza.name += ' SUPER FAT!';
      await pizza.save({ transaction: t });
    }
  }).catch((err) => console.log('TransError: ', err));
}

module.exports = { sequelize, Turtle, Pizza, Weapon };