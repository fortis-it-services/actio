import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatCardModule } from '@angular/material/card';
import { WorkflowEffects } from './state/workflow/workflow.effects';
import { UserEffects } from './state/user/user.effects';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { reducers } from './state/app-state';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { extModules } from './build-specifics';
import { MatChipsModule } from '@angular/material/chips';
import { WorkflowRunTableComponent } from './workflow-run-table/workflow-run-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TimeElapsedPipe } from './time-elapsed.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowRunTableComponent,
    TimeElapsedPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatSidenavModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      WorkflowEffects,
      UserEffects,
    ]),
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    MatSliderModule,
    MatTooltipModule,
    MatChipsModule,
    extModules,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  providers: [MatIconRegistry],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor(public matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/github.svg',
      ),
    )
  }
}
