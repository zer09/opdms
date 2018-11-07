import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitlesService } from '../../service/common/titles.service';
import { LanguageService } from '../../service/common/language.service';
import { ReligionService } from '../../service/common/religion.service';
import { CityService } from '../../service/common/city.service';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './patient-profile.page.html',
    styleUrls: ['./patient-profile.page.scss'],
})
export class PatientProfilePage implements OnInit {

    private _ptId: string;
    private _drSignature: string;
    private _new: boolean;

    public segmentAdditional = 'contact';
    public segmentVital = 'vital';

    constructor(
        public titles: TitlesService,
        public languages: LanguageService,
        public religions: ReligionService,
        public cities: CityService,
        private _aRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.titles.fetchTitles();
        this.languages.fetchLanguages();
        this.religions.fetchReligion();
        this.cities.fetchCities();

        this._ptId = this._aRoute.snapshot.paramMap.get('pt');
        this._drSignature = this._aRoute.snapshot.paramMap.get('dr');
        this._new = this._ptId.length < 1;

        console.log({ _id: this._ptId, _dr: this._drSignature });
    }

    public segmentChangeAddInfo(ev: any) {
        this.segmentAdditional = ev.target.value;
    }

    public segmentChangeVital(ev: any) {
        this.segmentVital = ev.target.value;
    }

}
