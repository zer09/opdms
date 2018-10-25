import { Component, OnInit } from '@angular/core';
import { TitlesService } from '../../service/common/titles.service';
import { ReligionService } from '../../service/common/religion.service';
import { LanguageService } from '../../service/common/language.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(
        public titles: TitlesService,
        public religions: ReligionService,
        public languages: LanguageService,
    ) { }

    ngOnInit() {
        this.titles.fetchTitles();
        this.religions.fetchReligion();
        this.languages.fetchLanguages();
    }

    public titlePopover(event: Event) {
        this.titles.popOver(event);
    }

    public religionPopover(event: Event) {
        this.religions.popOver(event);
    }

    public languagePopover(event: Event) {
        this.languages.popOver(event);
    }

}
