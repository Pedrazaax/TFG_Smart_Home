import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ControlAdminComponent } from './_components/control-admin/control-admin.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { FooterComponent } from './_components/footer/footer.component';
import { DispositivoComponent } from './_components/dispositivo/dispositivo.component';
import { AppConfig } from './app.config';
import { AddDeviceComponent } from './_components/add-device/add-device.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ControlAdminComponent,
    SidebarComponent,
    FooterComponent,
    DispositivoComponent,
    AddDeviceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
