import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { UserTypeGuard } from './guard/user-type.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        children: [],
        canActivate: [AuthGuard, UserTypeGuard]
    },
    {
        path: 'auth',
        loadChildren: './page/auth/auth.module#AuthPageModule'
    },
    {
        path: 'admin',
        loadChildren: './page/admin/admin.module#AdminPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'doctor',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadChildren: './page/doctor/doctor.module#DoctorPageModule',
            },
            {
                path: 'medicines',
                loadChildren: './page/medicines/medicines.module#MedicinesPageModule',
            }
        ]
    },
    {
        path: 'secretary',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadChildren: './page/secretary/secretary.module#SecretaryPageModule',
            }
        ]
    },
    {
        path: 'settings',
        loadChildren: './page/settings/settings.module#SettingsPageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'registration',
        loadChildren: './page/registration/registration.module#RegistrationPageModule'
    },
    {
        path: 'serverList',
        loadChildren: './page/server-list/server-list.module#ServerListPageModule'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
