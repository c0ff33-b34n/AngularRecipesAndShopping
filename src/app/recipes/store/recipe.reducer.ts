import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
    switch (action.type) {
        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipeActions.UPDATE_RECIPE:
            const updatedRecipe = { ...state.recipes[action.payload.index],
                ...action.payload.newRecipe}; // { ...state.recipes } creates a copy of the Recipe otherwise it would be a pointer
                                              // ...action.payload.newRecipe spreads all properties of updated Recipe and merges them
            const updatedRecipes = [...state.recipes]; // copy all of the original recipes
            updatedRecipes[action.payload.index] = updatedRecipe; // replace the recipe at the index with the updated recipe.

            return {
                ...state,
                recipes: updatedRecipes
            };
        case RecipeActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload;
                }) // filter will always return a new list.
            };
        default:
            return state;
    }
}
