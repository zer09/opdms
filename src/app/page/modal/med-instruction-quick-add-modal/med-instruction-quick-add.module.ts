import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MedInstructionQuickAddPage } from './med-instruction-quick-add.page';

const routes: Routes = [
  {
    path: '',
    component: MedInstructionQuickAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MedInstructionQuickAddPage]
})
export class MedInstructionQuickAddPageModule {}
