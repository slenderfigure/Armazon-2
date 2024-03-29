import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ProductVariant } from '../models/product-variant.model';
import { ShoppingBagService } from '../services/shopping-bag.service';
import { delay, tap, switchMap } from 'rxjs/operators';
import { SrchMatch } from '../models/srch-match.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  product: Product;
  originalId: number = 0;
  variants: ProductVariant[] = [];
  quantity: number = 1;
  isLoading: boolean = true;
  reloading: boolean = false;
  

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cs: ShoppingBagService
  ) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
  }

  ngAfterViewInit(): void {
    const variantId = +this.route.snapshot.queryParamMap.get('variantId');
    this.originalId = +this.route.snapshot.paramMap.get('id')

    if (!variantId) { 
      this.getProductInfo(this.originalId); 
    } else {
      this.getProductInfo(variantId);
    }
    
    this.route.queryParamMap.subscribe(params => {
      const variantId = +params.get('variantId');
      
      if (this.validVariant(variantId) && !this.isLoading) {
        this.getProductInfo(variantId);
      }
    });
  }

  private validVariant(id: number): boolean {
    return id && this.variants.some(variant => {
      return variant.variantId === id;
    });
  }

  private getProductInfo(productId: number): void {    
    if (!this.product) {
      this.isLoading = true;
    } else {
      this.reloading = true;
    }

    this.ps.getProductById(productId).pipe(
      delay(300),
      tap(product => {
        this.product = product;
        this.setSrchHistory(this.product)
      }),
      switchMap(() => this.ps.getProductVariant(this.originalId))
    ).subscribe(variants => {
      this.variants = variants;

      this.setPageTitle({
        name: this.product.productName,
        category: this.product.category,
        variant: this.variants.find(val => {
          return val.variantId == this.product.productId;
        })?.optionValue
      });
      this.isLoading = false;
      this.reloading = false;
    });
  }

  private setPageTitle(param: {
    name: string,
    category: string,
    variant?: string
  }): void {
    const titleTag = <HTMLTitleElement>document.head.querySelector('title');
    const _title1 = `${param.name}, ${param.variant}, ${param.category} - Armazon 2`; 
    const _title2 = `${param.name}, ${param.category} - Armazon 2`; 

    titleTag.textContent = param.variant ? _title1 : _title2;
  }

  private setSrchHistory(product: Product): void {
    let srchHistory: SrchMatch[] = JSON.parse(localStorage.getItem('search-history'));

    const srchItem: SrchMatch = {
      productId:    product.productId,
      productImage: product.images[0],
      productName:  product.productName,
      categoryId:   product.categoryId,
      category:     product.category
    }

    if (!srchHistory || !srchHistory.length) {
      localStorage.setItem('search-history', JSON.stringify([srchItem]));
    } else {
      if (srchHistory.some(item => item.productId == srchItem.productId)) {
        srchHistory = srchHistory.filter(item => item.productId !== srchItem.productId);
      }
      if (srchHistory.length == 6) {
        srchHistory.pop();
      }
      srchHistory.unshift(srchItem);
      localStorage.setItem('search-history', JSON.stringify(srchHistory));
    }
  }

  onBuyNow(productId: number): void {
    console.log('Buying product ', productId);
  }

  onAddToBag(productId: number): void {
    const item = {
      productId: productId,
      quantity: this.quantity
    }
    this.cs.addToBag(item).subscribe();
  }

}
