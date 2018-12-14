import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.page.html',
  styleUrls: ['./medicines.page.scss'],
})
export class MedicinesPage implements OnInit {

  public genericName = new FormControl();
  public brandName = new FormControl();
  public medForm = new FormControl();
  public strength = new FormControl();
  public medication = new FormControl();

  constructor() { }

  ngOnInit() {
  }

  public s2Toggle(ev): void {
    console.log(ev);
  }

}
