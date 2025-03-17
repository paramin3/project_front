import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClassesComponent } from './classes/classes.component';
import { MembershipComponent } from './membership/membership.component';
import { ShopComponent } from './shop/shop.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AchievementDetailsComponent } from './achievement-details/achievement-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TrainersComponent } from './trainers/trainers.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AddressManagementComponent } from './address-management/address-management.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ShopDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'achievement/:id', component: AchievementDetailsComponent },
  { path: 'trainers', component: TrainersComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'address-management', component: AddressManagementComponent }, // Add this route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}