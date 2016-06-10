import {container} from 'needlepoint';

import {Dish} from './classes/dish';
import {Ingredient} from './classes/ingredient';
import {Nutrient} from './classes/nutrient';
import {Query} from './classes/query';
import {Recipe} from './classes/recipe';
import {User} from './classes/user';

const query = 'Oranges';

// const ingredientDetails = new IngredientDetails();
// const ingredientSearch = new IngredientSearch();

let ingredientDetails = container.resolve(IngredientDetails);
let ingredientQueries = container.resolve(IngredientQueries);

ingredientDetails.save(query);
ingredientQueries.save(query)
