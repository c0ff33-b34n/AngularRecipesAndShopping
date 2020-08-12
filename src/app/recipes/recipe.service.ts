import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('A Test Recipe', 'This is simply a test', 'https://cdn.pixabay.com/photo/2015/11/30/09/34/salad-1069916_960_720.jpg'),
        new Recipe('Another Test Recipe', 'This is also simply a test', 'https://cdn.pixabay.com/photo/2020/06/03/18/45/muesli-5255994_960_720.jpg')
      ];

    getRecipes() {
        return this.recipes.slice(); // slice returns a copy of the array, otherwise it would pass a reference.
    }
}
