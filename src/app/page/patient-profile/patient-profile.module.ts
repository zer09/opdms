import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PatientProfilePage } from './patient-profile.page';
import { ResponsiveModule } from 'ngx-responsive';

const routes: Routes = [
    {
        path: '',
        component: PatientProfilePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ResponsiveModule.forRoot(),
    ],
    declarations: [PatientProfilePage]
})
export class PatientProfilePageModule { }
