import { Injectable } from '@angular/core';
import { City } from '../../interface/common/city';
import { StoreService } from '../store.service';
import { LoggerService } from '../logger.service';
import { PopoverController, AlertController } from '@ionic/angular';
import { Helper } from '../../helper';
import { AddRemovePopoverPage } from '../../page/common/add-remove-popover/add-remove-popover.page';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  public cityList: City[] = [];

  constructor(
    private _sSvc: StoreService,
    private _logSvc: LoggerService,
    private _popCtrl: PopoverController,
    private _alertCtrl: AlertController,
  ) { }

  public fetchCities() {
    this.cityList = [];
    this._sSvc.get(Helper.defStore)
      .allDocs({
        include_docs: true,
        startkey: `settings:city:`,
        endkey: `settings:city:\ufff0`
      }).then(res => {
        const rows = res.rows;

        for (let i = 0; i < rows.length; i++) {
          const doc = rows[i].doc;
          this.cityList.push({
            _id: doc._id,
            _rev: doc._rev,
            city: doc.city
          });
        }
      }).catch(e => this._logSvc.log(e));
  }

  public add(city: string) {
    if (!city || city.trim().length < 1) {
      return;
    }

    city = city.trim();

    this._sSvc.get(Helper.defStore)
      .put({
        _id: `settings:city:${city}`,
        city: city
      }).then(res => {
        if (!res.ok) {
          return;
        }

        this.cityList.push({
          _id: res.id,
          _rev: res.rev,
          city: city
        });
      }).catch(e => this._logSvc.log(e));
  }

  public remove(cities: City[]) {
    for (let i = 0; i < cities.length; i++) {
      (cities[i] as any)._deleted = true;
    }

    this._sSvc.get(Helper.defStore)
      .bulkDocs(cities).then(() => this.fetchCities())
      .catch(e => this._logSvc.log(e));
  }

  private _alertAdd(): void {
    this._alertCtrl.create({
      header: 'Add New City/Municipality',
      inputs: [{
        name: 'city',
        placeholder: 'City/Municipality',
        type: 'text'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Add',
        handler: data => this.add(data.city),
      }]
    }).then(a => a.present());
  }

  private _alertRM(): void {
    const del = this.cityList.filter(t => t['_deleted']);
    const cities: string[] = [];

    for (let i = 0; i < del.length; i++) {
      cities.push(del[i].city);
    }

    this._alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure to remove selected cities/municipalities?<br>' +
        cities.join('<br>'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Confirm',
        handler: () => this.remove(del)
      }]
    }).then(a => a.present());
  }

  public popOver(event: Event) {
    this._popCtrl.create({
      component: AddRemovePopoverPage,
      event: event,
      componentProps: {
        addCB: this._alertAdd.bind(this),
        rmCB: this._alertRM.bind(this),
      }
    }).then(p => p.present());
  }
}
