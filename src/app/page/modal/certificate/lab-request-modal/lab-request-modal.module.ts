import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LabRequestModalPage } from './lab-request-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LabRequestModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LabRequestModalPage]
})
export class LabRequestModalPageModule {}
