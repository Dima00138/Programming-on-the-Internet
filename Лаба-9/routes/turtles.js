const app = require('express');
const router = app.Router();
const turtleService = require('../services/turtleservice');


router.get('/turtles', async (req, res) => {
    const qFP = req.query.favoritePizza;
    let turtles;
    if (qFP) {
        let qPizza = req.query.favoritePizza;
        turtles = await turtleService.getTurtlesByFavoritePizza(qPizza);
    }
    else
        turtles = await turtleService.getAllTurtles();
    res.json(turtles);
});
  
router.get('/turtles/:id', async (req, res) => {
    let qId = req.params.id || 1;
    try {
      let turtles = await turtleService.getTurtleById(qId);
      res.json(turtles);
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: '404'});
    }
});
  
router.post('/turtles', async (req, res) => {
    const newTurtle = req.body;
    try {
        const createdTurtle = await turtleService.createTurtle(newTurtle);
        res.json(createdTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.put('/turtles/:id', async (req, res) => {
    const id = req.params.id;
    const turtleData = req.body;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, turtleData);
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.delete('/turtles/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTurtle = await turtleService.deleteTurtle(id);
        res.json(deletedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.put('/turtles/:id/favoritePizzaBind', async (req, res) => {
    const id = req.params.id;
    const pizzaId = req.body.pizzaId;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, { favoritePizzaId: pizzaId });
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.put('/turtles/:id/secondFavoritePizzaBind', async (req, res) => {
    const id = req.params.id;
    const pizzaId = req.body.pizzaId;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, { secondFavoritePizzaId: pizzaId });
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.put('/turtles/:id/weaponBind', async (req, res) => {
    const id = req.params.id;
    const weaponId = req.body.weaponId;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, { weaponId: weaponId });
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.delete('/turtles/:id/favoritePizzaUnbind', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, { favoritePizzaId: null });
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.delete('/turtles/:id/secondFavoritePizzaUnbind', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, { secondFavoritePizzaId: null });
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.delete('/turtles/:id/weaponUnbind', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTurtle = await turtleService.updateTurtle(id, { weaponId: null });
        res.json(updatedTurtle);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});

module.exports = router;