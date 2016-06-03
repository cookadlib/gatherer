import {container, dependencies} from 'needlepoint';
import {Database} from './database';

// @dependencies(Database, )
@dependencies(Database)
class Ingredient {
  constructor(database) {
    this.database = database;
    this.ref = this.db.ref('ingredient');
  }

}

let instance = container.resolve(Ingredient);
let zest = instance.database.query('Zest');
