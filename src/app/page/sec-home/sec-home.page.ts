import { Component, OnInit } from '@angular/core';
import { PeersService } from '../../service/peers.service';
import { AlertController } from '@ionic/angular';
import { SecDoctor } from '../../class/sec-doctor';

@Component({
    selector: 'app-sec-home',
    templateUrl: './sec-home.page.html',
    styleUrls: ['./sec-home.page.scss'],
})
export class SecHomePage implements OnInit {

    private _selectedDoctor: SecDoctor = SecDoctor.Default;

    constructor(
        private _peers: PeersService,
        private _alertCtrl: AlertController,
    ) { }

    ngOnInit() {
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

}
