import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Visit } from '../../class/visit';
import { MedicationInstruction } from '../../interface/medication-instruction';
import { CurrentClinicalImpressionService } from '../../service/current-clinical-impression.service';
import { FindingExaminationService } from '../../service/finding-examination.service';
import { MedicationInstructionService } from '../../service/medication-instruction.service';
import { MedicationsService } from '../../service/medications.service';
import { PresentComplaintService } from '../../service/present-complaint.service';
import { VisitService } from '../../service/visit.service';
import { MedInstructionQuickAddPage } from '../modal/med-instruction-quick-add-modal/med-instruction-quick-add.page';
import { MedicineQuickAddModalPage } from '../modal/medicine-quick-add-modal/medicine-quick-add-modal.page';


@Component({
  selector: 'app-visit',
  templateUrl: './visit.page.html',
  styleUrls: ['./visit.page.scss'],
})
export class VisitPage implements OnInit {

  private _vid!: string;
  private _visit!: Visit;

  public title = '';
  public nameLongString = '';
  public completeAddress = '';

  public vitalSignFB!: FormGroup;

  public BMI = '';
  public PTS = '';
  public allergies = '';
  public notes = '';
  public vitalSegment = '0';
  public detailsSegment = '0';

  public pcFC = new FormControl();
  public pcFilteredOptions!: Observable<string[]>;
  public pcTextArea = '';

  public cciFC = new FormControl();
  public cciFilteredOptions!: Observable<string[]>;
  public cciTextArea = '';

  public feFC = new FormControl();
  public feFilteredOptions!: Observable<string[]>;
  public feTextArea = '';

  public medsFC = new FormControl();
  public medsFilteredOptions!: Observable<string[]>;

  public medQtyFC = new FormControl();

  public medSigFC = new FormControl();
  public medSigFilteredOptions!: Observable<MedicationInstruction[]>;

  constructor(
    private _vSvc: VisitService,
    private _pcSvc: PresentComplaintService,
    private _cciSvc: CurrentClinicalImpressionService,
    private _feSvc: FindingExaminationService,
    private _medSvc: MedicationsService,
    private _medIns: MedicationInstructionService,
    private _aRoute: ActivatedRoute,
    private _navCtrl: NavController,
    private _fb: FormBuilder,
    private _modalCtrl: ModalController,
  ) {
    this._initVitalSignFB();
  }

  ngOnInit() {
    this._vid = this._aRoute.snapshot.paramMap.get('vid') || '';
    if (this._vid === '') {
      this._navCtrl.goBack();
    }

    this._initVisit();

    this.pcFilteredOptions = this.pcFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._pcSvc.pcList.filter(o => o.toLowerCase().indexOf(v) === 0);
      })
    );

    this.cciFilteredOptions = this.cciFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._cciSvc.cciList.filter(o => o.toLowerCase().indexOf(v) === 0);
      })
    );

    this.feFilteredOptions = this.feFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._feSvc.feList.filter(o => o.toLowerCase()
          .indexOf(v) === 0);
      })
    );

    this.medsFilteredOptions = this.medsFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._medSvc.medsList.filter(o => o.toLowerCase()
          .indexOf(v) === 0);
      })
    );

    this.medSigFilteredOptions = this.medSigFC.valueChanges.pipe(
      startWith(''),
      map((v: string): MedicationInstruction[] => {
        v = v.toLowerCase();
        return this._medIns.instructions.filter(o => o.instruction.toLowerCase()
          .indexOf(v) === 0);
      })
    );

    this.medQtyFC.setValue(100);

  }

  public get medQtyList(): number[] {
    return this._medSvc.qtyList;
  }

  private _initVisit(): void {
    this._vSvc.getVisit(this._vid).then(v => {
      this._visit = v;
      this.title = this._visit.appointment.patient.toString();
      this.nameLongString = this._visit.appointment.patient.toLongString();
      this.completeAddress = this._visit.appointment.patient.completeAddress();
    });
  }

  private _initVitalSignFB() {
    this.vitalSignFB = this._fb.group({
      bloodPressure: [''],
      pulse: [''],
      weight: [''],
      height: [''],
      temp: [''],
      resp: [''],
      waist: [''],
      hip: [''],
    });
  }

  public newMeds(): void {
    this._modalCtrl.create({
      component: MedicineQuickAddModalPage,
      backdropDismiss: false,
    }).then(m => {
      m.onDidDismiss().then((t: OverlayEventDetail<string>) => {
        if (t.data && t.data.length > 0) {
          this.medsFC.setValue(t.data);
        }
      });

      m.present();
    });
  }

  private _newInstruction(inst: string): void {
    this._modalCtrl.create({
      component: MedInstructionQuickAddPage,
      componentProps: { inst },
      backdropDismiss: false,
    }).then((m) => m.present());
  }

  public addMedication(): void {

  }

  public vitalSegmentChange(ev: any): void {
    this.vitalSegment = ev.target.value;
  }

  public detailsSegmentChange(ev: any): void {
    this.detailsSegment = ev.target.value;
  }

  public pcFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.pcFC.value.trim();
      if (v.length > 0) {
        this._pcSvc.save(v);
        this.pcFC.setValue('');

        if (this.pcTextArea.length > 0) {
          this.pcTextArea += `\n${v}`;
        } else {
          this.pcTextArea = v;
        }
      }
    }
  }

  public cciFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.cciFC.value.trim();
      if (v.length > 0) {
        this._cciSvc.save(v);
        this.cciFC.setValue('');

        if (this.cciTextArea.length > 0) {
          this.cciTextArea += `\n${v}`;
        } else {
          this.cciTextArea = v;
        }
      }
    }
  }

  public feFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.feFC.value.trim();
      if (v.length > 0) {
        this._feSvc.save(v);
        this.feFC.setValue('');

        if (this.feTextArea.length > 0) {
          this.feTextArea += `\n${v}`;
        } else {
          this.feTextArea = v;
        }
      }
    }
  }

  public medsFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.medsFC.value.trim();
      if (v.length > 0) {
        this._medSvc.save(v, false);
        this.medsFC.setValue('');
      }
    }
  }

  public medSigFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.medSigFC.value.trim();
      if (v.length > 0) {
        this._newInstruction(v);
      }
    }
  }

  public pcOptSel(ev: MatAutocompleteSelectedEvent): void {
    if (ev.option.value && ev.option.value.length > 0) {
      this.pcFC.setValue('');
      if (this.pcTextArea.length > 0) {
        this.pcTextArea += `\n${ev.option.value}`;
      } else {
        this.pcTextArea = ev.option.value;
      }
    }
  }

  public cciOptosel(ev: MatAutocompleteSelectedEvent): void {
    if (ev.option.value && ev.option.value.length > 0) {
      this.cciFC.setValue('');
      if (this.cciTextArea.length > 0) {
        this.cciTextArea += `\n${ev.option.value}`;
      } else {
        this.cciTextArea = ev.option.value;
      }
    }
  }

  public feOptSel(ev: MatAutocompleteSelectedEvent): void {
    if (ev.option.value && ev.option.value.length > 0) {
      this.feFC.setValue('');
      if (this.feTextArea.length > 0) {
        this.feTextArea += `\n${ev.option.value}`;
      } else {
        this.feTextArea = ev.option.value;
      }
    }
  }
}
