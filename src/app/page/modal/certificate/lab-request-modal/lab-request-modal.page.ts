import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab-request-modal',
  templateUrl: './lab-request-modal.page.html',
  styleUrls: ['./lab-request-modal.page.scss'],
})
export class LabRequestModalPage implements OnInit {

  public labs: string[] = [];

  constructor() {
    // just for testing
    this.labs.push('test 1');
    this.labs.push('test 2');
    this.labs.push('test 3');
    this.labs.push('test 4');
    this.labs.push('test 1');
    this.labs.push('test 2');
    this.labs.push('test 3');
    this.labs.push('test 4');
    this.labs.push('test 1');
    this.labs.push('test 2');
    this.labs.push('test 3');
    this.labs.push('test 4');
  }

  ngOnInit() {
  }

}
