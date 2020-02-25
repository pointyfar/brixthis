import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatMenuModule,
  MatInputModule,
  MatExpansionModule
  /*
  MatIconModule
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatGridListModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSortModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatStepperModule
  */
} from '@angular/material';

@NgModule({

  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatMenuModule,
    MatInputModule,
    MatExpansionModule
    /*
    MatIconModule
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatGridListModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatStepperModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
    */
  ]
})
export class MaterialModule {}
