import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { ApiKey } from '../auth.apikey';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
export class AuthEffects {
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + ApiKey.getApiKey(),
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(resData => {
                    // dispatch a new action.
                    const expirationDate = new Date(
                        new Date().getTime() + +resData.expiresIn * 1000);
                    return new AuthActions.Login({
                        email: resData.email,
                        userId: resData.localId,
                        token: resData.idToken,
                        expirationDate
                    });
                }),
                catchError(errorRes => {
                    let errorMessage = 'An unknown error occurred';
                    if (!errorRes.error || !errorRes.error.error) {
                        return of(new AuthActions.LoginFail(errorMessage));
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
                    // must return a non-error observable, because this effect should not die or future requests will not work.
                    return of(new AuthActions.LoginFail(errorMessage)); // of() creates a new observable. i.e. one without an error.
                })
            );
        })
    );

    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
