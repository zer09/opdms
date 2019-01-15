import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NoNameLetterModalPage } from './no-name-letter-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NoNameLetterModalPage
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
  declarations: [NoNameLetterModalPage]
})
export class NoNameLetterModalPageModule { }
