import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { WorkflowEffects } from './state/workflow/workflow.effects';
import { UserEffects } from './state/user/user.effects';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { reducers } from './state/app-state';
import { HttpClientModule } from '@angular/common/http';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { extModules } from './build-specifics';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { WorkflowRunTableComponent } from './workflow-run-table/workflow-run-table.component';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {SettingsService} from './settings.service';
import {registerLocaleData} from '@angular/common';
import de from '@angular/common/locales/de';
import en from '@angular/common/locales/en';
import fr from '@angular/common/locales/fr';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {WorkflowRunDetailsComponent} from './workflow-run-details/workflow-run-details.component';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';

registerLocaleData(de);
registerLocaleData(en);
registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    WorkflowRunTableComponent,
    WorkflowRunDetailsComponent,
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
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [SettingsService],
      useFactory: (settingsService: SettingsService) => settingsService.userLanguage(),
    },
    MatIconRegistry,
  ],
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
