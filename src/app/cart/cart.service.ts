import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';

import { CartItem } from './cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private URL = 'http://127.0.0.1/market-api/shopping-cart.php';

  private cartViewStateSource: Subject<boolean> = new Subject();
  cartViewState$: Observable<boolean> = this.cartViewStateSource.asObservable();

  private cartChangeSource: Subject<boolean> = new Subject();
  cartChange$: Observable<boolean> = this.cartChangeSource.asObservable();


  constructor(private http: HttpClient) { }

  openShoppingCart(view: boolean): void {
    this.cartViewStateSource.next(view);
  }

  getItemCount(userId: number): Observable<number> {
    return this.http.get<{total: number}>(`${this.URL}?userId=${userId}&count=true`)
    .pipe(
      map(count => count.total),
      catchError(this.errorHandler)
    );
  }

  getShoppingCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.URL}?userId=${userId}`)
    .pipe(
      delay(300),
      catchError(this.errorHandler)
    );
  }

  addToCart(item: { 
    userId: number, 
    productId: number, 
    quantity: number 
  }): Observable<any> {
    return this.http.post<any>(this.URL, item).pipe(
      tap(() => {
        this.cartViewStateSource.next(true);
        this.cartChangeSource.next(true);
      }),
      catchError(this.errorHandler)
    );
  }

  updateItemQuantity(item: { 
    userId: number, 
    productId: number, 
    quantity: number 
  }): Observable<any> {
    return this.http.put<any>(this.URL, item).pipe(
      tap(() => {
        this.cartViewStateSource.next(true);
        this.cartChangeSource.next(true);
      }),
      catchError(this.errorHandler)
    );
  }

  removeFromCart(userId: number, productId: number): Observable<any> { 
    return this.http.delete<any>(`${this.URL}?userId=${userId}&productId=${productId}`)
    .pipe(
      tap(() => {
        this.cartViewStateSource.next(true);
        this.cartChangeSource.next(true);
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