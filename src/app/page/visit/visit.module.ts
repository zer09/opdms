import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ResponsiveModule } from 'ngx-responsive';
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
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
  ],
  declarations: [VisitPage]
})
export class VisitPageModule { }
