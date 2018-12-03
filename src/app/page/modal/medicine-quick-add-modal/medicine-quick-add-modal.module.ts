import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicineQuickAddModalPage } from './medicine-quick-add-modal.page';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MedicineQuickAddModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MedicineQuickAddModalPage]
})
export class MedicineQuickAddModalPageModule { }
