import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { take } from 'rxjs/operators';

@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private store: Store<fromApp.AppState>,
                private actions$: Actions) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.store.dispatch(new RecipeActions.FetchRecipes());
        return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES),
            take(1)
        ); // observable will be triggered when SET_RECIPES is triggered.
    }
}
