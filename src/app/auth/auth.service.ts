import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiKey } from './auth.apikey';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthService {
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + ApiKey.getApiKey(),
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
            tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + ApiKey.getApiKey(),
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
        tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            Token: string;
            TokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData.Token, new Date(userData.TokenExpirationDate));

        if (loadedUser.token) {
            this.store.dispatch(
                new AuthActions.Login({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData.TokenExpirationDate)
                })
            );
            const expirationDuration = new Date(userData.TokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.store.dispatch(new AuthActions.Login({email, userId, token, expirationDate}));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email submitted was already registered';
                break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errorMessage = 'Email and password combination incorrect';
                break;
        }
        return throwError(errorMessage);
    }

}
