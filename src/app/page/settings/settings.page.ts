import { Component, OnInit } from '@angular/core';
import { TitlesService } from '../../service/common/titles.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(
        public titles: TitlesService,
    ) { }

    ngOnInit() {
        this.titles.fetchTitles();
    }

    public titlePopover(event) {
        this.titles.popOver(event);
    }

}
