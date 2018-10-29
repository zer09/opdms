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
        path: 'AdminHome',
        loadChildren: './page/admin-home/admin-home.module#AdminHomePageModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'DoctorHome',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadChildren: './page/doctor-home/doctor-home.module#DoctorHomePageModule',
            },
            {
                path: 'medicines',
                loadChildren: './page/medicines/medicines.module#MedicinesPageModule',
            }
        ]
    },
    {
        path: 'SecHome',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadChildren: './page/sec-home/sec-home.module#SecHomePageModule',
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
