import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermostatoComponent } from './termostato/termostato.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path : 'login',component:LoginComponent},
  {path: '',redirectTo:'login',pathMatch:'full'},
  {path: 'termostato', component: TermostatoComponent},
  {path : 'register',component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
