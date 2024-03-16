const app = require('express');
const router = app.Router();
const pizzaService = require('../services/pizzaservice');


router.get('/pizzas', async (req, res) => {
    const caloriesQuery = req.query.calories;
    if(caloriesQuery){
    const [comparison, calories] = caloriesQuery.split(' ');
    if ((comparison === 'gt' || comparison === 'lt') && !isNaN(calories)) {
      const pizzas = await pizzaService.getPizzaByCalories(calories, comparison);
      res.json(pizzas);
    }
    else
      return res.status(404).json({ error: '404' });
  } else {
    const pizzas = await pizzaService.getAllPizzas();
    res.json(pizzas);
    }
});
  
router.get('/pizzas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pizza = await pizzaService.getPizzaById(id);
        res.json(pizza);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.post('/pizzas', async (req, res) => {
    const newPizza = req.body;
    try {
        const createdPizza = await pizzaService.createPizza(newPizza);
        res.json(createdPizza);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.put('/pizzas/:id', async (req, res) => {
    const id = req.params.id;
    const pizzaData = req.body;
    try {
        const updatedPizza = await pizzaService.updatePizza(id, pizzaData);
        res.json(updatedPizza);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
  router.delete('/pizzas/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedPizza = await pizzaService.deletePizza(id);
        res.json(deletedPizza);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
  });

module.exports = router;