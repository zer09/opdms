import { Component, OnInit } from '@angular/core';
import { ServerAddressService } from '../../service/server-address.service';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-server-list',
    templateUrl: './server-list.page.html',
    styleUrls: ['./server-list.page.scss'],
})
export class ServerListPage implements OnInit {

    public serverName: string;
    public serverAddress: string;
    public serverRadioGroup: string;

    constructor(
        private _saSvc: ServerAddressService,
        private _mdlCtrl: ModalController,
    ) { }

    ngOnInit() {
        this.serverName = '';
        this.serverAddress = '';
        this._saSvc.getDefaultServer().then(server => {
            this.serverRadioGroup = server.key;
        });
    }

    public close() {
        this._mdlCtrl.dismiss();
    }

    public get addressMaps() {
        const m = new Map<string, string>();
        const orig = this._saSvc.addressMaps();
        const iterator = orig.keys();

        let k = iterator.next();

        do {
            if (k && k.value !== 'remote') {
                m.set(k.value, orig.get(k.value));
            }
            k = iterator.next();
        } while (!k.done);

        return m;
    }

    public addServer() {
        if (this.serverName.length < 1 || this.serverAddress.length < 1) {
            return;
        }

        this._saSvc.addServer(this.serverName, this.serverAddress);
        this.serverName = '';
        this.serverAddress = '';
    }

    public defaultServerChange(event) {
        this._saSvc.setDefaultServer(event.detail.value);
    }

}
