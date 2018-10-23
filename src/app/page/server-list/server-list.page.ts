import { Component, OnInit } from '@angular/core';
import { ServerAddressService } from '../../service/server-address.service';

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
    ) { }

    ngOnInit() {
        this.serverName = '';
        this.serverAddress = '';
        this._saSvc.getDefaultServer().then(server => {
            this.serverRadioGroup = server.key;
        });
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
