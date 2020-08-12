import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('Pasta Dish',
            'This is simply a test',
            'https://cdn.pixabay.com/photo/2015/11/30/09/34/salad-1069916_960_720.jpg',
            [
                new Ingredient('Tin of Tomatoes', 1),
                new Ingredient('Small Packet of Pasta', 1),
                new Ingredient('Brown Onion', 1),
                new Ingredient('Sprig of Thyme', 1),
                new Ingredient('Handful of Basil Leaves', 1),
                new Ingredient('Knob of Butter', 1)
            ]
            ),
        new Recipe('Healthy Breakfast of Kings',
            'This is also simply a test',
            'https://cdn.pixabay.com/photo/2020/06/03/18/45/muesli-5255994_960_720.jpg',
            [
                new Ingredient('Packet of Muesli', 1),
                new Ingredient('Pint of Milk', 1),
                new Ingredient('Apples', 3),
                new Ingredient('Banana', 1),
                new Ingredient('Blueberries', 8),
                new Ingredient('Thimble of Cinnamon', 1)
            ]
            )
      ];

    getRecipes() {
        return this.recipes.slice(); // slice returns a copy of the array, otherwise it would pass a reference.
    }
}
