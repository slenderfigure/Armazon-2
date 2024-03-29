import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { UserAccount } from '../models/user-account.model';

export interface LoginInfo { username: string; password: string }
export interface LoginState { 
  success: boolean; 
  error?: { username: boolean, password: boolean },
  message?: string 
}
export interface AuthInfo { active: boolean; role?: 'ADMIN' | 'USER' }

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: '2454789645'
  }),
  withCredentials: true,
  // observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL1 = 'http://127.0.0.1/market-api/user.php';
  private URL2 = 'http://127.0.0.1/market-api/user-login.php';
  private URL3 = 'http://127.0.0.1/market-api/user-signup.php';
  private URL4 = 'http://127.0.0.1/market-api/user-logout.php';
  private URL5 = 'http://127.0.0.1/market-api/user-auth.php';

  constructor(private http: HttpClient) { }

  get isLoggedin(): Observable<boolean> {
    return this.http.get<AuthInfo>(this.URL5, httpOptions)
    .pipe(
      map(authInfo => authInfo.active),
      catchError(this.errorHandler)
    );
  }

  get isAdmin(): Observable<AuthInfo> {
    return this.http.get<AuthInfo>(this.URL5, httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  loginRequest(login: LoginInfo): Observable<LoginState> {
    return this.http.post<LoginState>(
      this.URL2, 
      login,
      httpOptions
    ).pipe(
      delay(400),
      catchError(this.errorHandler)
    );
  }

  logoutRequest(): Observable<any> {
    return this.http.get<LoginState>(this.URL4, httpOptions)
    .pipe(
      delay(300),
      catchError(this.errorHandler)
    );
  }

  verifyEmailExists(email: string): Observable<{exists: boolean}> {
    return this.http.get<{exists: boolean}>(
      `${this.URL3}?email=${email}`, 
      httpOptions
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  signupRequest(details: {}): Observable<LoginState> {
    return this.http.post<LoginState>(
      this.URL3,
      details, 
      httpOptions
    ).pipe(
      delay(400),
      catchError(this.errorHandler)
    );
  }

  getUserAccount(): Observable<UserAccount> {
    return this.http.get<UserAccount>(this.URL1, httpOptions)
    .pipe(
      delay(300),
      map(user => {
        user.signupDate = new Date(user.signupDate);
        return user;
      }),
      catchError(this.errorHandler)
    );
  }

  private errorHandler(err: HttpErrorResponse) {
    let error = '';

    if (err.error instanceof ErrorEvent) {
      error = err.error.message;
    } else {
      error = err.error;
    }
    return throwError(error);
  }

}
