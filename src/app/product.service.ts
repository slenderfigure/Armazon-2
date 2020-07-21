import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';

import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private URL  = 'http://127.0.0.1/market-api/products.php';
  private URL2 = 'http://127.0.0.1/market-api/product-category.php';
  private URL3  = 'http://127.0.0.1/market-api/product-variant.php';

  constructor(private http: HttpClient) { }

  addProducts(form: FormData): Observable<any> {
    return this.http.post<any>(this.URL, form).pipe(
      delay(1000),
      tap(res => console.log(res)),
      catchError(this.errorHandler)
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.URL).pipe(
      // tap(res => console.log(res)),
      catchError(this.errorHandler)
    );
  }

  getProducts2(start: number, end: number): Observable<Product[]> {
    const URL = 'http://127.0.0.1/market-api/test.php';

    return this.http.get<Product[]>(`${URL}?start=${start}&count=${end}`)
    .pipe(
      delay(300),
      catchError(this.errorHandler)
    );
  }

  getProductVariant(productId: number): Observable<ProductVariant[]> {
    return this.http.get<ProductVariant[]>(`${this.URL3}?productId=${productId}`)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.URL}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.URL2).pipe(
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