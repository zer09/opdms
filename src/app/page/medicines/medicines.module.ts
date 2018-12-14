import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedicinesPage } from './medicines.page';
import { MatInputModule, MatAutocompleteModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MedicinesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatAutocompleteModule,
  ],
  declarations: [MedicinesPage]
})
export class MedicinesPageModule { }
