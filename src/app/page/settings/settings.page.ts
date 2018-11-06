import { Component, OnInit } from '@angular/core';
import { TitlesService } from '../../service/common/titles.service';
import { ReligionService } from '../../service/common/religion.service';
import { LanguageService } from '../../service/common/language.service';
import { SecretaryService } from '../../service/common/secretaries.service';
import { UserService } from '../../service/user.service';
import { UserType } from '../../enum/user/user-type.enum';
import { CityService } from '../../service/common/city.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    public UserType = UserType;

    constructor(
        public usr: UserService,
        public secretaries: SecretaryService,
        public titles: TitlesService,
        public religions: ReligionService,
        public languages: LanguageService,
        public cities: CityService,
    ) { }

    ngOnInit() {
        if (this.usr.user.userType === UserType.DOCTOR) {
            this.secretaries.fetchDoctorSecrtaries();
        }

        this.titles.fetchTitles();
        this.religions.fetchReligion();
        this.languages.fetchLanguages();
        this.cities.fetchCities();
    }

    public secPopover(event: Event) {
        this.secretaries.popOver(event);
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

    public cityPopover(event: Event) {
        this.cities.popOver(event);
    }

}
