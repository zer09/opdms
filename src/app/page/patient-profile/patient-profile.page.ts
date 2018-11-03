import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './patient-profile.page.html',
    styleUrls: ['./patient-profile.page.scss'],
})
export class PatientProfilePage implements OnInit {

    private _ptId: string;
    private _drSignature: string;
    private _new: boolean;

    constructor(
        private _aRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this._ptId = this._aRoute.snapshot.paramMap.get('pt');
        this._drSignature = this._aRoute.snapshot.paramMap.get('dr');
        this._new = this._ptId.length < 1;

        console.log({ _id: this._ptId, _dr: this._drSignature });
    }

}
