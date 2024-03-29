import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { Rating } from '../models/rating.model';
import { Review } from '../models/review.model';
import { ReviewRatingService } from '../services/review-rating.service';
import { ReviewFormService } from '../services/review-form.service';

@Component({
  selector: 'product-ratings',
  templateUrl: './product-ratings.component.html',
  styleUrls: ['./product-ratings.component.scss']
})
export class ProductRatingsComponent implements OnInit {
  @ViewChild('container') container: ElementRef<HTMLElement>;
  private productId: number;
  rating: Rating = { overall: 0, totalReviews: 0 };
  userRating: number[] = [];
  reviews: Review[] = [];
  rowcount: number = 5;
  viewRatings: boolean = false;
  isLoading: boolean = true;
  reloading: boolean = false;

  constructor(
    private rs: ReviewRatingService,
    private rf: ReviewFormService
  ) { }

  ngOnInit(): void {
    this.rs.ratingViewState$.subscribe(productId => {
      this.productId = productId;
      this.viewRatings = true;
      this.isLoading = true;

      this.rs.getProductRating(this.productId).subscribe(rating => {
        this.rating = rating;     
      });

      this.rs.getAllProductReviews(productId).subscribe(reviews => {
        this.userRating = reviews.map(review => review.userRating);
      });
      
      this.rs.getOffsetProductReviews(this.productId, 0, this.rowcount)
      .subscribe(reviews => {
        this.reviews = reviews;
        this.isLoading = false;
      });
    });
  }

  onReviewPageChange(currentPage: number = 0): void {
    this.reloading = true;
    this.container.nativeElement.scrollTo({ top: 0 });

    this.rs.getOffsetProductReviews(
      this.productId, 
      currentPage * this.rowcount, 
      this.rowcount
    ).subscribe(reviews => {
      this.reviews = reviews;
      this.reloading = false;
    });
  }

  writeReview(): void {
    this.rf.openReviewForm(this.productId);
  }
}
