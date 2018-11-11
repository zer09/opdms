import { Injectable } from '@angular/core';
import { SecDoctor } from '../class/sec-doctor';
import { IPatientSearch } from '../interface/ipatient-search';
import { StoreService } from './store.service';
import { EncryptGCM } from '../class/encrypt-gcm';
import { Patient } from '../class/patient';
import { Helper } from '../helper';

@Injectable({
    providedIn: 'root'
})
export class PatientSearchService {

    private _searchTerms: string[] = [];
    private _searchedPatients: Map<string, IPatientSearch>;

    constructor(
        private _sSvc: StoreService,
        private _enc: EncryptGCM,
    ) { }

    public get showAddButton(): boolean {
        return this._searchTerms.length > 0;
    }

    private _indexSearch(term: string, dr: SecDoctor): Promise<string[]> {
        return this._sSvc.get(dr.PTI).allDocs({
            include_docs: true,
            startkey: term,
            endkey: `${term}\ufff0`
        }).then(res => {
            const r = res.rows;
            const rr: string[] = [];

            for (let i = 0; i < r.length; i++) {
                rr.push(...r[i].doc.l);
            }

            return Helper.unique(rr);
        });
    }

    public onSearch(ev: any, dr: SecDoctor[]) {
        this._searchTerms.length = 0;
        this._searchedPatients = new Map<string, IPatientSearch>();

        if (!ev || !ev.target.value) {
            return;
        }

        const terms = ev.target.value.split(/\s+/);

        if (terms.length === 1 && terms[0].length < 3) {
            this._searchTerms.length = 0;
            return;
        }

        for (let i = 0; i < terms.length; i++) {
            if (terms[i].length > 2 && !this._searchTerms.includes(terms[i])) {
                this._searchTerms.push(terms[i]);
            }
        }

        dr.forEach(drElem => {
            const ps = this._sSvc.get(drElem.PS);
            this._searchedPatients.set(drElem.signature, {
                Dr: drElem,
                Patient: []
            });

            this._searchTerms.forEach(tElem => {
                this._indexSearch(tElem, drElem).then(ids => {
                    const pts = this._searchedPatients
                        .get(drElem.signature).Patient;

                    for (let i = 0; i < ids.length; i++) {
                        ps.get(ids[i]).then(doc => {
                            const pt = new Patient(doc._id);
                            pt.unminified(this._enc.decrypt(doc.p, drElem.UUID2));
                            pts.push(pt);
                        });
                    }
                });
            });
        });
    }
}
