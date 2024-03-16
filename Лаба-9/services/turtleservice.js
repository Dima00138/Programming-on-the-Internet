const { Turtle, Pizza } = require('../db');

class TurtleService {
  async getAllTurtles() {
    return await Turtle.findAll();
  }

  async getTurtleById(id) {
    if (isNaN(id)) {
      throw new Error('ID must be a number');
    }
    return await Turtle.findByPk(id);
  }

  async getTurtlesByFavoritePizza(pizzaName) {
    return await Turtle.findAll({
      include: [{
        model: Pizza,
        as: 'favoritePizza',
        where: { name: pizzaName }
      }]
    });
  }

  async createTurtle(turtleData) {
    console.log(turtleData);
    if (turtleData.name == '' || turtleData.color == '')
      throw new Error('Name & color must be fulfilled');
    return await Turtle.create(turtleData);
  }

  async updateTurtle(id, turtleData) {
    if (isNaN(id) || turtleData.name == '' || turtleData.color == '')
      throw new Error('Id must be a number \nName & color must be fulfilled');
    const turtle = await this.getTurtleById(id);
    return await turtle.update(turtleData);
  }

  async deleteTurtle(id) {
    const turtle = await this.getTurtleById(id);
    return await turtle.destroy();
  }
}

module.exports = new TurtleService();
