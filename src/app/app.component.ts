import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  hideNavbar: boolean = true;
  hideFooter: boolean = true;
  title = 'marketplace';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.hideUrlOnRoute();
  }

  private hideUrlOnRoute(): void {
    this.router.events.pipe(
      filter(events => events instanceof NavigationEnd)
    ).subscribe((navigation: NavigationEnd) => {
      const url = navigation.urlAfterRedirects;

      this.hideNavbar = url.includes('login') || url.includes('signup');
      this.hideFooter = url.includes('login') || url.includes('signup');
    });
  }
}
