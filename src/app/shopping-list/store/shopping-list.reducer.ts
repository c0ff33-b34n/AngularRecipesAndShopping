import { Ingredient } from '../../shared/ingredient.model';
import * as SLA from './shopping-list.actions';

const initialState = {
    ingredients: [
        new Ingredient('Apples', 3),
        new Ingredient('Pears', 4)
    ]
};

export function shoppingListReducer(state = initialState, action: SLA.ShoppingListActions) {
    switch (action.type) {
        case SLA.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case SLA.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case SLA.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.ingredient
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case SLA.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter( (ig, igIndex) => {
                    return igIndex !== action.payload;
                })
            };
        default:
            return state;
    }
}
