import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-color-one',
  templateUrl: './color-one.component.html',
  styleUrls: ['./color-one.component.css'],
  encapsulation:ViewEncapsulation.ShadowDom
})
export class ColorOneComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
