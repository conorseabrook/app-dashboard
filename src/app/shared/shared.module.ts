import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDirective } from 'app/shared/directives/input.directive';
import { OncheckedDirective } from './directives/onchecked.directive';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from 'app/shared/components/spinner/spinner.component';
import { AssetsLoaderIndicatorComponent } from 'app/shared/components/assets-loader-indicator/assets-loader-indicator.component';
import { AutocompleteinputDirective } from './directives/autocompleteinput.directive';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { AccordionDirective } from './directives/accordion.directive';
import { StickyDirective } from './directives/sticky.directive';
import { LoopIncludePipe } from './pipes/loop-include.pipe';
import { LoopExcludePipe } from './pipes/loop-exclude.pipe';
import { TimelineComponent } from 'app/shared/components/timeline/timeline.component';
import { JsonPreviewComponent } from 'app/shared/components/json-preview/json-preview.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { HttpClientModule } from '@angular/common/http';
import { ClickThisActiveDirective } from './directives/click-this-active.directive';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { NotificationComponent } from './components/notification/notification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EventAddComponent } from './../modules/dashboard/event-add/event-add.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CheckIfPipe } from './pipes/checkIf.pipe';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, MatDialogModule],
  exports: [
    CommonModule,
    InputDirective,
    OncheckedDirective,
    SpinnerComponent,
    AssetsLoaderIndicatorComponent,
    AutocompleteinputDirective,
    BreadcrumbsComponent,
    AccordionDirective,
    StickyDirective,
    LoopIncludePipe,
    LoopExcludePipe,
    TimelineComponent,
    JsonPreviewComponent,
    SvgIconComponent,
    ClickThisActiveDirective,
    QrCodeComponent,
    NotificationComponent,
    MatDialogModule,
    PaginationComponent,
    CheckIfPipe
  ],
  declarations: [
    InputDirective,
    OncheckedDirective,
    SpinnerComponent,
    AssetsLoaderIndicatorComponent,
    AutocompleteinputDirective,
    BreadcrumbsComponent,
    AccordionDirective,
    StickyDirective,
    LoopIncludePipe,
    LoopExcludePipe,
    TimelineComponent,
    JsonPreviewComponent,
    SvgIconComponent,
    ClickThisActiveDirective,
    QrCodeComponent,
    NotificationComponent,
    PaginationComponent,
    CheckIfPipe
  ],
  entryComponents: [JsonPreviewComponent, EventAddComponent]
})
export class SharedModule {}
