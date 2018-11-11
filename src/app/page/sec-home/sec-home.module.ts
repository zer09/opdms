import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ResponsiveModule } from 'ngx-responsive';

import { IonicModule } from '@ionic/angular';

import { SecHomePage } from './sec-home.page';

const routes: Routes = [
  {
    path: '',
    component: SecHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ResponsiveModule.forRoot()
  ],
  declarations: [SecHomePage]
})
export class SecHomePageModule { }
