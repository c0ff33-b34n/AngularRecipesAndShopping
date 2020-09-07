import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable()
export class DataStorageService {
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService,
                private store: Store<fromApp.AppState>) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put('https://ng-course-recipes-shopping.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://ng-course-recipes-shopping.firebaseio.com/recipes.json')
        .pipe(
            map(recipes => { // rxjs map operator
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                }); // JS map array method
            }),
            tap(recipes => {
            this.store.dispatch(new RecipeActions.SetRecipes(recipes));
            })
        ); // take will only take 1 value from observable before automatically unsubscribing.
    } // exhaustMap allows you to combine observables
}
