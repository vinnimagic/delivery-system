import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules - CORRIGIDOS
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'; // ← "from-field" → "form-field"
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper'; // ← "steeper" → "stepper"
import { MatProgressBarModule } from '@angular/material/progress-bar'; // ← "ProgressBand" → "ProgressBar"
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; // ← "tist" → "list"
import { MatToolbarModule } from '@angular/material/toolbar'; // ← "ToolBar" → "Toolbar"
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge'; // ← "Badged" → "Badge"
import { MatTabsModule } from '@angular/material/tabs'; // ← "Tabst" → "Tabs"

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
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
    MatTabsModule
  ]
})
export class MaterialModule { }