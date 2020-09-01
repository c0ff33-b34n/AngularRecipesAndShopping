import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as SLA from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe('Pasta Dish',
    //         'This is simply a test',
    //         'https://cdn.pixabay.com/photo/2015/11/30/09/34/salad-1069916_960_720.jpg',
    //         [
    //             new Ingredient('Tin of Tomatoes', 1),
    //             new Ingredient('Small Packet of Pasta', 1),
    //             new Ingredient('Brown Onion', 1),
    //             new Ingredient('Sprig of Thyme', 1),
    //             new Ingredient('Handful of Basil Leaves', 1),
    //             new Ingredient('Knob of Butter', 1)
    //         ]
    //         ),
    //     new Recipe('Healthy Breakfast of Kings',
    //         'This is also simply a test',
    //         'https://cdn.pixabay.com/photo/2020/06/03/18/45/muesli-5255994_960_720.jpg',
    //         [
    //             new Ingredient('Packet of Muesli', 1),
    //             new Ingredient('Pint of Milk', 1),
    //             new Ingredient('Apples', 3),
    //             new Ingredient('Banana', 1),
    //             new Ingredient('Blueberries', 8),
    //             new Ingredient('Thimble of Cinnamon', 1)
    //         ]
    //         )
    //   ]; // Dummy data in case I want to repopulate it if it is lost on the server.
    private recipes: Recipe[] = [];

    constructor(private store: Store<fromShoppingList.AppState>) {}

    getRecipes() {
        return this.recipes.slice(); // slice returns a copy of the array, otherwise it would pass a reference.
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.store.dispatch(new SLA.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
