const { Weapon } = require('../db');
const { Op } = require('sequelize');

class WeaponService {
  async getAllWeapons() {
    return await Weapon.findAll();
  }

  async getWeaponById(id) {
    if (isNaN(id)) {
      throw new Error('ID must be a number');
    }
    return await Weapon.findByPk(id);
  }
  
  async getWeaponsByDps(dps, comparison) {
    if (comparison === 'gt')
      return await Weapon.findAll({
        where: {
          dps: {
            [Op.gt]: dps
          }
        }
      });
    else if (comparison === 'lt')
      return await Weapon.findAll({
        where: {
          dps: {
            [Op.lt]: dps
          }
        }
      });
    }

  async createWeapon(weaponData) {
    if (weaponData.dps > 500 || weaponData.name == '')
      throw new Error('DPS cannot be more than 500 & name must be fulfilled');
    return await Weapon.create(weaponData);
  }

  async updateWeapon(id, weaponData) {
    if (weaponData.dps > 500 || weaponData.name == '' || isNaN(id))
      throw new Error('DPS cannot be more than 500 & name must be fulfilled');
    const weapon = await this.getWeaponById(id);
    return await weapon.update(weaponData);
  }

  async deleteWeapon(id) {
    const weapon = await this.getWeaponById(id);
    return await weapon.destroy();
  }
}

module.exports = new WeaponService();
