import { Component, AfterViewInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Input } from '@angular/core';

import { LightboxService } from './lightbox.service';
import { LightboxData } from './lightbox.model';

@Component({
  selector: 'lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements AfterViewInit {
  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLElement>; 
  @ViewChild('rangeIndicator') rangeIndicator: ElementRef<HTMLElement>; 
  @Input() images: string[];
  currentImage: number = 0;
  openLightbox: boolean = false;

  constructor(private ls: LightboxService) { }

  ngAfterViewInit(): void {
    this.ls.$currentImage.subscribe(data => {
      this.openLightbox = true;
      this.currentImage = data.index;
      this.moveIndicator();
      setTimeout(() => this.scrollIntoView(data.scrollBehavior));
    });
  }

  private scrollIntoView(behavior: 'auto' | 'smooth'): void {
    const slides = Array.from(this.imageContainer.nativeElement.children);

    slides[this.currentImage].scrollIntoView({ behavior: behavior });    
  }

  private moveIndicator(): void {
    const indicator = this.rangeIndicator.nativeElement;
    const steps = 100 * this.currentImage;

    indicator.style.transform = `translateX(${steps}%)`;
  }

  onNavButtonClick(direction: 'previous' | 'next'): void {
    switch (direction) {
      case 'previous':
        if (this.currentImage == 0) { return; }        
        this.currentImage--;
        break;

      case 'next':
        if (this.currentImage == this.images.length - 1) { return; }        
        this.currentImage++;
        break;
    
      default:
        console.log('Invalid direction: ', direction);
        break;
    }
    this.ls.openLightbox({index: this.currentImage, scrollBehavior: 'smooth'});
  }

  onRangeClick(e: MouseEvent): void {
    const indicator = this.rangeIndicator.nativeElement;
    const rects     = indicator.getBoundingClientRect();
    const width     = indicator.clientWidth;
    const left      = Math.floor(rects.left);
    const right     = Math.floor(rects.right);
    
    if (e.clientX < left || e.clientX > right) {
      const pos = Math.floor(e.clientX / width);
      // this.currentImage = Math.floor(e.clientX / width) - 1;
      // this.ls.openLightbox({index: this.currentImage, scrollBehavior: 'smooth'});

      console.log({ 
        click: e.clientX, 
        width: width, 
        test: e.clientX - right,
        test2: Math.ceil((e.clientX - right) / width)
      });
    }
  }

  onClose(): void {
    this.openLightbox = false;
    this.currentImage = 0;
  }

}
    