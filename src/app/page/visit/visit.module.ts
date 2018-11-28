import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ResponsiveModule } from 'ngx-responsive';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';

import { VisitPage } from './visit.page';

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
    MatAutocompleteModule,
    MatInputModule,
  ],
  declarations: [VisitPage]
})
export class VisitPageModule { }
