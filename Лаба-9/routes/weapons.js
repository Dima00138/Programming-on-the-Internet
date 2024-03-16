const app = require('express');
const router = app.Router();
const weaponService = require('../services/weaponservice');

router.get('/weapons', async (req, res) => {
    const dpsQuery = req.query.dps;
    
    if (dpsQuery) {
      const [comparison, dps] = dpsQuery.split(' ');
      if ((comparison === 'gt' || comparison === 'lt') && !isNaN(dps)) {
        const weapons = await weaponService.getWeaponsByDps(dps, comparison);
        res.json(weapons);
      } else
        return res.status(404).json({ error: '404' });
    } else {
      const weapons = await weaponService.getAllWeapons();
      res.json(weapons);
    }
});
  
  
router.get('/weapons/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const weapon = await weaponService.getWeaponById(id);
        res.json(weapon);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.post('/weapons', async (req, res) => {
    const newWeapon = req.body;
    try {
        const createdWeapon = await weaponService.createWeapon(newWeapon);
        res.json(createdWeapon);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.put('/weapons/:id', async (req, res) => {
    const id = req.params.id;
    const weaponData = req.body;
    try {
        const updatedWeapon = await weaponService.updateWeapon(id, weaponData);
        res.json(updatedWeapon);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});
  
router.delete('/weapons/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedWeapon = await weaponService.deleteWeapon(id);
        res.json(deletedWeapon);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({ error: '404'});
    }
});

module.exports = router;