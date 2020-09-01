import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import * as SLA from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index); // get the ingredient based on index passed
                                                               // when shopping list component is selected
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new SLA.UpdateIngredient({index: this.editedItemIndex, ingredient}));
    } else {
      this.store.dispatch(new SLA.AddIngredient(ingredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.store.dispatch(new SLA.DeleteIngredient(this.editedItemIndex));
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
