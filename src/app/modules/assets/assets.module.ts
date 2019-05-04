/*
 * Copyright: Ambrosus Inc.
 * Email: tech@ambrosus.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { EventResolver } from 'app/guards/event-resolver.service';
import { AssetResolver } from 'app/guards/asset-resolver.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from 'app/modules/assets/assets-routing.module';
import { AssetComponent } from 'app/modules/assets/asset/asset.component';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AssetsComponent } from 'app/modules/assets/assets/assets.component';
import { AssetAddComponent } from './asset-add/asset-add.component';
import { RouterModule } from '@angular/router';
import { AssetsOutletComponent } from './assets-outlet/assets-outlet.component';
import { EventComponent } from './event/event.component';
import { EventAddComponent } from './event-add/event-add.component';
import { AssetFormComponent } from './forms/asset-form/asset-form.component';
import { EventFormComponent } from './forms/event-form/event-form.component';
import { JsonFormComponent } from './forms/json-form/json-form.component';
import { InterceptorService } from 'app/interceptors/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [
    CommonModule,
    AssetsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    AssetComponent,
    AssetsComponent,
    AssetsOutletComponent,
    EventComponent,
    SearchComponent,
    AssetAddComponent,
    EventAddComponent,
    AssetFormComponent,
    EventFormComponent,
    JsonFormComponent,
  ],
  providers: [
    AssetResolver,
    EventResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  entryComponents: [
    AssetAddComponent,
    EventAddComponent,
    AssetFormComponent,
    EventFormComponent,
    JsonFormComponent,
  ],
})
export class AssetsModule { }
