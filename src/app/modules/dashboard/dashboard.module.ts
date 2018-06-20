import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from 'app/modules/dashboard/dashboard-routing.module';
import { AssetComponent } from 'app/modules/dashboard/asset/asset.component';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AssetsComponent } from 'app/modules/dashboard/assets/assets.component';
import { AssetAddComponent } from './asset-add/asset-add.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventComponent } from './event/event.component';
import { EventAddComponent } from './event-add/event-add.component';
import { AssetsService } from 'app/services/assets.service';
import { StorageService } from '../../services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { NgStickyModule } from 'ng-sticky';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    QRCodeModule,
    NgStickyModule
  ],
  declarations: [
    AssetComponent,
    AssetsComponent,
    AssetAddComponent,
    DashboardComponent,
    EventComponent,
    EventAddComponent
  ],
  providers: [AssetsService, StorageService]
})
export class DashboardModule {}
