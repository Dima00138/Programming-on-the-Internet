const { Pizza } = require('../db');
const { Op } = require('sequelize');

class PizzaService {
  async getAllPizzas() {
    return await Pizza.findAll();
  }

  async getPizzaById(id) {
    if (isNaN(id)) {
      throw new Error('ID must be a number');
    }
    return await Pizza.findByPk(id);
  }

  async getPizzaByCalories(calories, comparison) {
    if (comparison === 'gt')
      return await Pizza.findAll({
        where: {
          calories: {
            [Op.gt]: calories
          }
        }
      });
    else if (comparison === 'lt')
      return await Pizza.findAll({
        where: {
          calories: {
            [Op.lt]: calories
          }
        }
      });
  }

  async createPizza(pizzaData) {
    if (pizzaData.calories > 2000 || pizzaData.calories < 0 || pizzaData.name == '')
      throw new Error("Calories must be < 2000 & all field must be fulfilled");
    return await Pizza.create(pizzaData);
  }

  async updatePizza(id, pizzaData) {
    if (pizzaData.calories > 2000 || pizzaData.calories < 0 || pizzaData.name == '')
      throw new Error("Calories must be < 2000 & all field must be fulfilled");
    const pizza = await this.getPizzaById(id);
    return await pizza.update(pizzaData);
  }

  async deletePizza(id) {
    const pizza = await this.getPizzaById(id);
    return await pizza.destroy();
  }
}

module.exports = new PizzaService();
