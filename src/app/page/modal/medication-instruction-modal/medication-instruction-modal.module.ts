import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatToolbarModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MedicationInstructionModalPage } from './medication-instruction-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MedicationInstructionModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatToolbarModule,
  ],
  declarations: [MedicationInstructionModalPage]
})
export class MedicationInstructionModalPageModule { }
