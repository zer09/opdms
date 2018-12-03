import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MedicationsService } from '../../../service/medications.service';

@Component({
  selector: 'app-medicine-quick-add-modal',
  templateUrl: './medicine-quick-add-modal.page.html',
  styleUrls: ['./medicine-quick-add-modal.page.scss'],
})
export class MedicineQuickAddModalPage implements OnInit {

  public genericNameFC = new FormControl();
  public brandNameFC = new FormControl();
  public medFormFC = new FormControl();
  public medStrengthFC = new FormControl();
  public medicationFC = new FormControl();

  public medFrmFilteredOptions!: Observable<string[]>;
  public medStrFilteredOptions!: Observable<string[]>;

  private _isS2 = false;

  constructor(
    private _modalCtrl: ModalController,
    private _medSvc: MedicationsService,
  ) { }

  ngOnInit() {
    this.genericNameFC.valueChanges.subscribe(() => this._finalMedicationForm());
    this.brandNameFC.valueChanges.subscribe(() => this._finalMedicationForm());
    this.medStrengthFC.valueChanges.subscribe(() => this._finalMedicationForm());
    this.medFormFC.valueChanges.subscribe(() => this._finalMedicationForm());

    this.medFrmFilteredOptions = this.medFormFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._medSvc.medsForms.filter(o => {
          return o.toLowerCase().indexOf(v) === 0;
        });
      })
    );

    this.medStrFilteredOptions = this.medStrengthFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._medSvc.medsStrengths.filter(o => {
          return o.toLowerCase().indexOf(v) === 0;
        });
      })
    );
  }

  private _finalMedicationForm(): void {
    if (!this.genericNameFC.value || this.genericNameFC.value.length < 1) {
      return this.medicationFC.setValue('');
    }

    let final = this.genericNameFC.value.trim();
    let brandName = this.brandNameFC.value;
    let strength = this.medStrengthFC.value;
    let medForm = this.medFormFC.value;

    brandName = brandName || '';
    strength = strength || '';
    medForm = medForm || '';

    if (brandName && brandName.length > 0) {
      final += ` (${brandName})`;
    }

    if (strength && strength.length > 0) {
      final += ` ${strength}`;
    }

    if (medForm && medForm.length > 0) {
      final += ` ${medForm}`;
    }

    this.medicationFC.setValue(final);
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }

  public s2Toggle(ev: CustomEvent): void {
    this._isS2 = ev.detail.checked;
  }

  public save(): void {
    this._medSvc.save(this.medicationFC.value, this._isS2);
    this._modalCtrl.dismiss(this.medicationFC.value);
  }

  public medFormFCBlur(ev: string): void {
    if (ev.length > 0) {
      this._medSvc.saveMedForm(ev);
    }
  }

  public medStrengthFCBlur(ev: string): void {
    if (ev.length > 0) {
      this._medSvc.saveMedStr(ev);
    }
  }
}
