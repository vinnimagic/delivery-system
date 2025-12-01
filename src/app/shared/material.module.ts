import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressBarModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTabsModule,
    // Forms
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  exports: [
    CommonModule,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressBarModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTabsModule,
    // Forms
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MaterialModule { }