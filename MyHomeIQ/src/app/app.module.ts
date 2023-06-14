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
import { ThermostatComponent } from './_components/thermostat/thermostat.component';
import { SocketComponent } from './_components/socket/socket.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BulbComponent } from './_components/bulb/bulb.component';
import { InicioComponent } from './_components/inicio/inicio.component';
import { IntroComponent } from './_components/intro/intro.component';
import { VideoCamaraComponent } from './_components/video-camara/video-camara.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ControlAdminComponent,
    SidebarComponent,
    FooterComponent,
    DispositivoComponent,
    AddDeviceComponent,
    ThermostatComponent,
    SocketComponent,
    BulbComponent,
    InicioComponent,
    IntroComponent,
    VideoCamaraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ColorPickerModule
  ],
  providers: [AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
