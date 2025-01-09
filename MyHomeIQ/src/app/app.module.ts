import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NvdapiService } from './_services/nvdapi.service';

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
import { ConsumoComponent } from './_components/consumo/consumo.component';
import { LoaderComponent } from './_components/loader/loader.component';
import { CheckComponent } from './_components/check/check.component';
import { FormAPIComponent } from './_components/form-api/form-api.component';
import { AlarmComponent } from './_components/alarm/alarm.component';
import { SensorComponent } from './_components/sensor/sensor.component';
import { ConsumoLocalComponent } from './_components/consumo-local/consumo-local.component';
import { SimuladorConsumosComponent } from './_components/simulador-consumos/simulador-consumos.component';
import { HistoryLogComponent } from './_components/history-log/history-log.component';
import { TruncatePipe } from './_pipes/truncate.pipe';
import { VulnerabilitiesListComponent } from './vulnerabilities-list/vulnerabilities-list.component';

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
    VideoCamaraComponent,
    ConsumoComponent,
    LoaderComponent,
    CheckComponent,
    FormAPIComponent,
    AlarmComponent,
    SensorComponent,
    ConsumoLocalComponent,
    SimuladorConsumosComponent,
    HistoryLogComponent,
    TruncatePipe,
    VulnerabilitiesListComponent,
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
  providers: [AppConfig, NvdapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
