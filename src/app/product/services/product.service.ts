import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

import { Product } from '../models/product.model';
import { ProductVariant } from '../models/product-variant.model';
import { SrchMatch } from '../models/srch-match.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private URL  = 'http://127.0.0.1/market-api/products.php';
  private URL2 = 'http://127.0.0.1/market-api/product-category.php';
  private URL3 = 'http://127.0.0.1/market-api/product-variant.php';
  private URL4 = 'http://127.0.0.1/market-api/product-variant-options.php';
  private URL5 = 'http://127.0.0.1/market-api/filtered-products.php';
  private URL6 = 'http://127.0.0.1/market-api/product-search.php';

  constructor(private http: HttpClient) { }

  addProducts(form: FormData): Observable<any> {
    return this.http.post<any>(this.URL, form).pipe(
      delay(1000),
      catchError(this.errorHandler)
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.URL).pipe(
      catchError(this.errorHandler)
    );
  }

  getOffsetProducts(start: number, end: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.URL5}?start=${start}&count=${end}`)
    .pipe(
      delay(300),
      catchError(this.errorHandler)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.URL}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }

  productExists(id: number): Observable<boolean> {
    return !id ? of(false) : new Observable(subscriber => {
      this.getProductById(id).subscribe(product => {      
        subscriber.next(!product ? false : true);
      });

      return {
        unsubscribe() { subscriber.unsubscribe(); }
      }
    });
  }

  searchProduct(keyword: string, categoryId = null): Observable<SrchMatch[]> {
    return this.http.get<SrchMatch[]>(
      !categoryId ? `${this.URL6}?keyword=${keyword}` :
      `${this.URL6}?keyword=${keyword}&categoryId=${categoryId}`
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.URL2).pipe(
      catchError(this.errorHandler)
    );
  }

  /** Product Variant Requests */  
  addProductVariant(form: FormData): Observable<any> {
    return this.http.post<any>(this.URL3, form).pipe(
      delay(1000),
      catchError(this.errorHandler)
    );
  }

  getProductVariant(id: number): Observable<ProductVariant[]> {
    return this.http.get<ProductVariant[]>(`${this.URL3}/${id}`)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  getVariantOptions(): Observable<any> {
    return this.http.get<any>(this.URL4).pipe(
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