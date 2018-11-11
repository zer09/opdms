import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddRemovePopoverPage } from './add-remove-popover.page';

const routes: Routes = [
  {
    path: '',
    component: AddRemovePopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddRemovePopoverPage]
})
export class AddRemovePopoverPageModule { }
