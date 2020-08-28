import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put('https://ng-course-recipes-shopping.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            return this.http.get<Recipe[]>('https://ng-course-recipes-shopping.firebaseio.com/recipes.json',
            {
                params: new HttpParams().set('auth', user.token)
            }
            );
        }),
            map(recipes => { // rxjs map operator
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                }); // JS map array method
            }),
            tap(recipes => {
            this.recipeService.setRecipes(recipes);
            })
        ); // take will only take 1 value from observable before automatically unsubscribing.
    } // exhaustMap allows you to combine observables
}
