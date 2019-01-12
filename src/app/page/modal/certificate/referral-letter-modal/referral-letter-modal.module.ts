import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReferralLetterModalPage } from './referral-letter-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReferralLetterModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatInputModule,
  ],
  declarations: [ReferralLetterModalPage]
})
export class ReferralLetterModalPageModule { }
