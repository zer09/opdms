import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ClearancesModalPage } from './clearances-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ClearancesModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClearancesModalPage]
})
export class ClearancesModalPageModule { }
