import { Component, OnChanges } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent, of } from 'rxjs';
import { map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProductService } from 'src/app/product/services/product.service';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { SrchMatch } from 'src/app/product/models/srch-match.model';
import { Category } from 'src/app/product/models/category.model';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnChanges {
  @ViewChild('overlay') overlay: ElementRef<HTMLElement>;
  @Input() showSearchbox: boolean;
  @Output('showSearchbox') notifyChange = new EventEmitter<boolean>();
  srchForm: FormGroup = new FormGroup({
    srchControl: new FormControl(null, Validators.required),
    categoryId: new FormControl(null)
  });
  matches$: Observable<SrchMatch[]>;
  categories$: Observable<Category[]>;
  srchHistory: SrchMatch[];
  isFocused: boolean = false;

  get srchControl(): AbstractControl {
    return this.srchForm.get('srchControl');
  }

  get categoryId(): AbstractControl {
    return this.srchForm.get('categoryId');
  }

  srchMatchHighlight(name: string): string {
    return name.slice(0, this.srchControl.value.length).toLowerCase();
  }

  srchMatchRemainder(name: string): string {
    return name.slice(this.srchControl.value.length).toLowerCase();
  }

  constructor(
    private router: Router,
    private ps: ProductService
  ) { }

  ngOnChanges(): void {
    if (this.showSearchbox) {
      this.srchHistory = localStorage.getItem('search-history') ?
      JSON.parse(localStorage.getItem('search-history')) : null;
      
      this.matches$ = this.srchControl.valueChanges.pipe(
        map(keyword => keyword?.toLowerCase()?.trim()),
        distinctUntilChanged(),
        debounceTime(25),
        switchMap(keyword => {
          return keyword?.length ? 
          this.ps.searchProduct(keyword, this.categoryId.value) : of ([]);
        }),
        map(matches => matches.slice(0, 6))
      );

      this.categories$ = this.ps.getCategories();
      
      document.body.classList.add('active-modal');
      fromEvent(window, 'keyup').subscribe((e: KeyboardEvent) => {
        if (e.key == 'Escape') { this.onClose(); }
      });
    } else {
      document.body.classList.remove('active-modal');
    }
  }

  onSubmit(): void {
    this.onClose();
    this.router.navigate(
      ['/products'],
      {
        queryParams: { 
          keyword: this.srchControl.value.trim().toLowerCase(),
          category: this.categoryId.value
        }
      }
    );
  }

  clearSrchHistory(): void {
    localStorage.removeItem('search-history');
    this.srchHistory = null;
  }

  onClose(): void {
    if (!this.overlay) { return; }
    
    const overlay = this.overlay.nativeElement;

    overlay.classList.add('hide');
    window.onkeyup = null;
    
    setTimeout(() => {
      document.body.classList.remove('active-modal');
      
      this.showSearchbox = false;
      this.notifyChange.emit(this.showSearchbox);
      this.srchForm.reset();
    }, 300);
  }

  onClickOutside(e: MouseEvent): void {
    if (e.target == e.currentTarget) { this.onClose(); }
  }
}
