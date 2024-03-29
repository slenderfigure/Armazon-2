import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { MainComponent } from './main/main.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { 
    path: 'home', 
    component: MainComponent, 
    data: { title: 'Home' } 
  },
  { 
    path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
  },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { 
    path: 'checkout', 
    component: CheckoutComponent, 
    data: { title: 'Checkout & Payment' } 
  },
  { 
    path: '404', 
    component: PageNotFoundComponent,
    data: { title: '404 - Not Found' } 
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
