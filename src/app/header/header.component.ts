import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.actions';
import * as RecipeAction from '../recipes/store/recipe.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }


  onSaveData() {
    this.store.dispatch(new RecipeAction.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipeAction.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthAction.Logout());
  }
}
