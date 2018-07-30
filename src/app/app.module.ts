import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { ChartistModule } from 'ng-chartist';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
    DashboardModule,
    AmChartsModule,
    ChartistModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
