import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeItemSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a test', 'https://cdn.pixabay.com/photo/2015/11/30/09/34/salad-1069916_960_720.jpg'),
    new Recipe('Another Test Recipe', 'This is also simply a test', 'https://cdn.pixabay.com/photo/2020/06/03/18/45/muesli-5255994_960_720.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeItemSelected.emit(recipe);
  }

}
