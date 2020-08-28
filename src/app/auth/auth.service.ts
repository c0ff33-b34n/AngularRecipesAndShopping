import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiKey } from './auth.apikey';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + ApiKey.getApiKey(),
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(errorRes => {
            let errorMessage = 'An unknown error occurred';
            if (!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage);
            }
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'The email submitted was already registered';
                    break;
            }
            return throwError(errorMessage);
        }));
    }

}
