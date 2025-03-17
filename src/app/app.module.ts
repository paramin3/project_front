import { NgModule } from '@angular/core'; 
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClassesComponent } from './classes/classes.component';
import { MembershipComponent } from './membership/membership.component';
import { ShopComponent } from './shop/shop.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AchievementDetailsComponent } from './achievement-details/achievement-details.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ClassService } from './class.service';  
import { TrainersComponent } from './trainers/trainers.component';
import { TrainerService } from './trainer.service';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AddressManagementComponent } from './address-management/address-management.component'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ClassesComponent,
    MembershipComponent,
    ShopComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AchievementDetailsComponent,
    ShopDetailsComponent,
    CartComponent,
    CheckoutComponent,
    TrainersComponent,
    MyOrdersComponent,
    AddressManagementComponent // Add TrainersComponent here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule, // Add HttpClientModule here
    FormsModule
  ],
  providers: [
    ClassService, // Add ClassService here
    TrainerService // Add TrainerService here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
