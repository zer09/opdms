import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisitPage } from './visit.page';
import { ResponsiveModule } from 'ngx-responsive';

const routes: Routes = [
  {
    path: '',
    component: VisitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ResponsiveModule.forRoot(),
  ],
  declarations: [VisitPage]
})
export class VisitPageModule { }
