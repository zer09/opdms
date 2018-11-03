import { Injectable } from '@angular/core';
import { SecDoctor } from '../class/sec-doctor';

@Injectable({
    providedIn: 'root'
})
export class PatientSearchService {

    private _searchTerms: string[] = [];

    constructor() { }

    public get showAddButton(): boolean {
        return this._searchTerms.length > 0;
    }

    public onSearch(ev: any, dr: SecDoctor[]) {
        this._searchTerms.length = 0;

        if (!ev || !ev.target.value) {
            return;
        }

        const terms = ev.target.value.split(/\s+/);

        if (terms.length === 1 && terms[0].length < 3) {
            this._searchTerms.length = 0;
            return;
        }

        for (let i = 0; i < terms.length; i++) {
            if (terms[i].length > 2) {
                this._searchTerms.push(terms[i]);
            }
        }
    }
}
