import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VisitService } from '../../service/visit.service';
import { Visit } from '../../class/visit';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(
    private _vSvc: VisitService,
    private _aRoute: ActivatedRoute,
    private _navCtrl: NavController,
    private _fb: FormBuilder,
  ) {
    this._initVitalSignFB();
  }

  ngOnInit() {
    this._vid = this._aRoute.snapshot.paramMap.get('vid') || '';
    if (this._vid === '') {
      this._navCtrl.goBack();
    }

    this._initVisit();
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

  public vitalSegmentChange(ev: any): void {
    this.vitalSegment = ev.target.value;
  }

  public detailsSegmentChange(ev: any): void {
    this.detailsSegment = ev.target.value;
  }
}
