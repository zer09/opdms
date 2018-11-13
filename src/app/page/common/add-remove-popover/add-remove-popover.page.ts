import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-remove-popover',
  templateUrl: './add-remove-popover.page.html',
  styleUrls: ['./add-remove-popover.page.scss'],
})
export class AddRemovePopoverPage implements OnInit {

  public showAdd: boolean;
  public showRemove: boolean;
  public showUpdate: boolean;

  public addText = 'Add';
  public removeText = 'Remove';
  public updateText = 'Update';

  public addCB: () => void;
  public rmCB: () => void;
  public upCB: () => void;

  constructor(
    private _navParams: NavParams,
    private _popCtrl: PopoverController,
  ) {
    this.addCB = this._navParams.get('addCB');
    this.rmCB = this._navParams.get('rmCB');
    this.upCB = this._navParams.get('upCB');

    this.showAdd = this._navParams.get('showAdd') || true;
    this.showRemove = this._navParams.get('showRemove') || true;
    this.showUpdate = this._navParams.get('showUpdate') || false;
  }

  ngOnInit() {
  }

  public add() {
    this._popCtrl.dismiss();
    if (!this.addCB) {
      return;
    }

    this.addCB();
  }

  public rm() {
    this._popCtrl.dismiss();
    if (!this.rmCB) {
      return;
    }

    this.rmCB();
  }

  public update() {
    this._popCtrl.dismiss();
    if (!this.upCB) {
      return;
    }

    this.upCB();
  }

}
