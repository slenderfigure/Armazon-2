import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  hideNavbar: boolean = true;
  hideFooter: boolean = true;
  title = 'Armazon 2';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ts: Title
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(events => events instanceof NavigationEnd)
    ).subscribe((navigation: NavigationEnd) => {
      const url = navigation.urlAfterRedirects;

      this.changePageTitle();
      this.hideNavbarFooter(url);
    });
  }

  private hideNavbarFooter(url: string): void {
    const routes = ['/user/login', '/user/signup', '/404'];
    
    this.hideNavbar = routes.some(route => url.includes(route));
    this.hideFooter = routes.some(route => url.includes(route));
  }

  private changePageTitle(): void {
    const routeTitle = this.route.firstChild.snapshot.data['title'];

    if (routeTitle) { this.ts.setTitle(routeTitle); }
  }
}
