import { Component, OnInit } from '@angular/core';
import { PeersService } from '../../service/peers.service';
import { AlertController } from '@ionic/angular';
import { SecDoctor } from '../../class/sec-doctor';
import { PatientSearchService } from '../../service/patient-search.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sec-home',
    templateUrl: './sec-home.page.html',
    styleUrls: ['./sec-home.page.scss'],
})
export class SecHomePage implements OnInit {

    private _selectedDoctor: SecDoctor = SecDoctor.Default;

    constructor(
        public ptSearch: PatientSearchService,
        private _peers: PeersService,
        private _alertCtrl: AlertController,
        private _route: Router,
    ) { }

    ngOnInit() {
    }

    public get searchOnDrs(): SecDoctor[] {
        return this._selectedDoctor === SecDoctor.Default ?
            this._peers.secDrs : [this._selectedDoctor];
    }

    public changeDoctor() {
        const dInputs: any[] = [];
        dInputs.push({
            type: 'radio',
            label: SecDoctor.Default.compactName(),
            value: SecDoctor.Default,
            checked: this._selectedDoctor === SecDoctor.Default
        });

        for (let i = 0; i < this._peers.secDrs.length; i++) {
            dInputs.push({
                type: 'radio',
                label: this._peers.secDrs[i].compactName(),
                value: this._peers.secDrs[i],
                checked: this._selectedDoctor === this._peers.secDrs[i]
            });
        }

        this._alertCtrl.create({
            header: 'Select Doctor',
            inputs: dInputs,
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'OK',
                handler: data => this._selectedDoctor = data,
            }]
        }).then(a => a.present());
    }

    public newPatient() {
        if (this._selectedDoctor !== SecDoctor.Default) {
            this._route.navigate([
                'PatientProfile', this._selectedDoctor.signature, ''
            ]);
            return;
        }

        const dInputs: any[] = [];
        let selectedDr: SecDoctor;

        for (let i = 0; i < this._peers.secDrs.length; i++) {
            dInputs.push({
                type: 'radio',
                label: this._peers.secDrs[i].compactName(),
                value: this._peers.secDrs[i],
            });
        }

        this._alertCtrl.create({
            header: 'Select Doctor',
            message: 'Please select to whom you want to save the new patient.',
            inputs: dInputs,
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'OK',
                handler: (dr: SecDoctor) => selectedDr = dr
            }]
        }).then(a => {
            a.onDidDismiss().then(() => {
                this._route.navigate([
                    'PatientProfile', selectedDr.signature, ''
                ]);
            });

            a.present();
        });

    }

}
